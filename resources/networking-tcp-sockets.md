# Networking Basics: TCP & Sockets

## The TCP/IP model

Network communication is organised into layers, each responsible for a different concern. The two layers most relevant for application developers are:

**IP (Internet Protocol)** handles addressing and routing. It delivers packets from one machine to another on a best-effort basis — packets may be lost, reordered, or duplicated.

**TCP (Transmission Control Protocol)** sits on top of IP and provides a reliable, ordered, connection-oriented byte stream. It retransmits lost packets, reorders out-of-order arrivals, and controls the rate of transmission to avoid overwhelming the receiver. From the application's perspective, writing to a TCP connection is like writing to a file — you send bytes in order and the receiver gets them in order.

## The three-way handshake

Before data can flow, TCP establishes a connection through a handshake:

1. The client sends a SYN (synchronise) segment to signal it wants to connect.
2. The server responds with SYN-ACK, acknowledging the client's sequence number and announcing its own.
3. The client sends ACK, completing the handshake.

Only after this exchange is the connection considered established. This ensures both sides agree on the starting sequence numbers and that the path is reachable in both directions.

## Sockets

A socket is the OS abstraction for one endpoint of a network connection. From the application's point of view it looks like a file descriptor — you read from it to receive data and write to it to send data. The OS handles all the TCP details underneath.

A server socket is bound to a port and listens for incoming connections. When a client connects, the server's `accept` call returns a new connected socket representing that specific client. The server can then read the client's request, process it, and write the response back — all through that socket.

## Handling multiple clients

A naïve server blocks on `accept`, handles one client to completion, then accepts the next. This works for demonstration purposes but fails in practice because one slow client blocks all others.

The standard approaches are:

**Thread per connection** spawns a new OS thread for each accepted connection. The threads run concurrently, so one client's slowness doesn't block others. The downside is memory and scheduling overhead — OS threads are expensive, so this approach doesn't scale to thousands of simultaneous connections.

**Event-driven / non-blocking I/O** uses a single thread with a selector (epoll on Linux, kqueue on macOS) that monitors many sockets at once and wakes only when a socket is ready to read or write. This is how Redis, Nginx, and Node.js handle enormous numbers of connections with minimal threads. The tradeoff is that your logic must be written as event handlers and you must never block the event loop.

**Thread pool** combines both: a fixed number of threads each pick up connections from a queue. This bounds memory use while still allowing concurrency.

## Language-specific guidance

### C

Use the POSIX socket API. Set `SO_REUSEADDR` so the port is immediately available after a restart, then `bind`, `listen`, and loop on `accept`. Ignore `SIGPIPE` so the process doesn't crash when the client disconnects mid-write.

```c
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <signal.h>

int server_fd = socket(AF_INET, SOCK_STREAM, 0);
int opt = 1;
setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

struct sockaddr_in addr = {0};
addr.sin_family      = AF_INET;
addr.sin_addr.s_addr = INADDR_ANY;
addr.sin_port        = htons(port);

bind(server_fd, (struct sockaddr *)&addr, sizeof(addr));
listen(server_fd, 8);
signal(SIGPIPE, SIG_IGN);

for (;;) {
    int client_fd = accept(server_fd, NULL, NULL);
    if (client_fd < 0) continue;
    handle_client(client_fd);
    close(client_fd);
}
```

**Reading bytes**: `read(fd, buf, n)` blocks until at least one byte arrives and returns the number of bytes actually read, or 0 on EOF, or -1 on error. Never assume one `read` fills the buffer — loop until you have all the bytes you need.

```c
int read_exact(int fd, char *buf, size_t n) {
    size_t total = 0;
    while (total < n) {
        ssize_t r = read(fd, buf + total, n - total);
        if (r <= 0) return 0;
        total += r;
    }
    return 1;
}
```

**Writing bytes**: `write(fd, buf, n)` may also write fewer bytes than requested (rare on TCP but possible). The same loop pattern applies.

---

### C++

The POSIX API is identical to C. A convenient shortcut is to wrap the accepted fd in `FILE*` via `fdopen` so you can use buffered `fgets`/`fprintf` instead of raw `read`/`write`.

```cpp
int client_fd = accept(server_fd, nullptr, nullptr);
FILE *in  = fdopen(dup(client_fd), "r");
FILE *out = fdopen(client_fd, "w");

char line[512];
while (fgets(line, sizeof(line), in)) {
    // process `line`, write response via `out`
    fprintf(out, "...\r\n");
    fflush(out);
}
fclose(in);   // closes the dup; fclose(out) closes client_fd
```

`dup` is needed because `fclose` closes the underlying fd — without it, closing `in` would also close `client_fd`, making `out` unusable.

Alternatively, read byte-by-byte with raw `read()` exactly as in C, or wrap in `std::unique_ptr<FILE, decltype(&fclose)>` for RAII cleanup.

---

### Python

```python
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(("0.0.0.0", port))
server.listen(8)

while True:
    conn, _ = server.accept()
    with conn:
        handle_client(conn)
```

Inside `handle_client`, call `conn.makefile("rb")` to get a buffered binary file object. `readline()` reads one line at a time (up to and including `\n`), and `read(n)` reads exactly `n` bytes.

```python
def handle_client(conn):
    f = conn.makefile("rb")
    while True:
        line = f.readline()
        if not line:
            break
        # process line, send response
        conn.sendall(b"...\r\n")
```

**Gotcha**: do not mix `conn.recv` and `makefile` on the same socket — the buffered reader may have already consumed bytes that `recv` would otherwise return. Pick one approach and stick to it.

---

### Rust

`TcpListener::bind` returns a listener; iterating `listener.incoming()` yields one `TcpStream` per accepted connection. Wrap the stream in `BufReader` for efficient line-oriented reads, and `try_clone` it for a separate write handle.

```rust
use std::io::{BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};

pub fn start(&mut self, port: u16) {
    let listener = TcpListener::bind(("0.0.0.0", port)).unwrap();
    for stream in listener.incoming() {
        self.handle_client(stream.unwrap());
    }
}

fn handle_client(&mut self, stream: TcpStream) {
    let mut writer = stream.try_clone().unwrap();
    let mut reader = BufReader::new(stream);

    let mut line = String::new();
    while reader.read_line(&mut line).unwrap_or(0) > 0 {
        // `line` includes the trailing \n (and \r before it if present)
        line.clear();
        writer.write_all(b"...\r\n").unwrap();
    }
}
```

`try_clone` is required because `BufReader` takes ownership of the stream — you need a separate handle to write back to the same connection.

For reading an exact number of bytes (rather than a line), use `Read::read_exact`:

```rust
use std::io::Read;

let mut buf = vec![0u8; n];
reader.read_exact(&mut buf).unwrap();
```

**Error handling**: prefer `io::Result<()>` as the return type of `handle_client` and propagate errors with `?` so a disconnected client unwinds cleanly instead of panicking.
