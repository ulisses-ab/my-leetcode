# RESP — Redis Serialization Protocol

RESP is the text protocol Redis uses to communicate over TCP. It is line-oriented and deliberately simple — no external parser library is needed.

## Wire format

Every value begins with a single-byte **type prefix** followed by a `\r\n` terminator.

| Prefix | Type | Example | Meaning |
|--------|------|---------|---------|
| `+` | Simple string | `+OK\r\n` | Short status reply |
| `-` | Error | `-ERR unknown command\r\n` | Error message |
| `:` | Integer | `:42\r\n` | Signed 64-bit integer |
| `$` | Bulk string | `$5\r\nhello\r\n` | Arbitrary binary data |
| `*` | Array | `*2\r\n:1\r\n:2\r\n` | Ordered list of RESP values |

**Nil bulk string** — a missing value (e.g. `GET` on a nonexistent key) is `$-1\r\n`, not an empty string.

**Nil array** — an absent array is `*-1\r\n`.

## How commands are sent

Every command arrives as a RESP array of bulk strings. `SET foo bar` on the wire looks like:

```
*3\r\n        ← array of 3 elements
$3\r\nSET\r\n ← bulk string of length 3
$3\r\nfoo\r\n ← bulk string of length 3
$3\r\nbar\r\n ← bulk string of length 3
```

Command names are **case-insensitive** (`set`, `SET`, and `SeT` are all valid).

## Parsing algorithm

1. Read a line (everything up to and including `\r\n`).
2. The first byte is the type prefix; the rest of the line (before `\r\n`) is the value.
3. For `*`: the value is the element count — read that many RESP values recursively.
4. For `$`: the value is the byte count — read exactly that many bytes, then consume the trailing `\r\n`.
5. For `+`, `-`, `:`: the value is the rest of the line.

## Language-specific guidance

### C

Read one byte at a time to find line boundaries. It is slow for large payloads but perfectly fine for a single-client server.

```c
/* Read a line into buf (including \r\n), return length or -1 on EOF */
int read_line(int fd, char *buf, int max) {
    int i = 0;
    char c;
    while (i < max - 1) {
        if (read(fd, &c, 1) <= 0) return -1;
        buf[i++] = c;
        if (c == '\n') break;
    }
    buf[i] = '\0';
    return i;
}

/* Read exactly n bytes into buf, return 0 on EOF */
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

To parse a bulk string: call `read_line` to get `$<len>\r\n`, parse the integer, call `read_exact` for the body, then call `read_exact` again to discard the trailing `\r\n`.

---

### C++

Use `fdopen` + `fgets` for line reading and `fread` for bulk bodies.

```cpp
// read a line (including \r\n)
char line[512];
fgets(line, sizeof(line), in);   // blocks until \n or EOF
int len = atoi(line + 1);        // skip the prefix byte, parse length

// read bulk string body
char *body = new char[len + 1];
fread(body, 1, len, in);
body[len] = '\0';
fread(line, 1, 2, in);           // discard trailing \r\n
```

`fgets` stops at `\n` and includes it in the result. The `\r` before it will be the second-to-last character — strip both when you only need the value.

---

### Python

`makefile("rb")` gives you `readline()` for lines and `read(n)` for bulk bodies.

```python
f = conn.makefile("rb")

def read_value(f):
    line = f.readline().rstrip(b"\r\n")
    prefix = chr(line[0])
    data = line[1:]

    if prefix == '+' or prefix == '-' or prefix == ':':
        return data.decode()
    if prefix == '$':
        n = int(data)
        if n == -1:
            return None
        body = f.read(n)
        f.read(2)           # discard \r\n
        return body
    if prefix == '*':
        count = int(data)
        if count == -1:
            return None
        return [read_value(f) for _ in range(count)]
```

`readline()` returns bytes including the trailing `\n`. `rstrip(b"\r\n")` removes both `\r` and `\n` before you inspect the prefix.

---

### Rust

Use `BufReader::read_line` for lines and `Read::read_exact` for bulk bodies.

```rust
use std::io::{BufRead, BufReader, Read};

fn read_value(reader: &mut BufReader<impl Read>) -> Option<RespValue> {
    let mut line = String::new();
    if reader.read_line(&mut line).ok()? == 0 {
        return None;
    }
    // line includes \r\n — strip it
    let line = line.trim_end_matches(['\r', '\n']);
    let (prefix, rest) = line.split_at(1);

    match prefix {
        "+" | "-" | ":" => Some(RespValue::Line(rest.to_string())),
        "$" => {
            let n: i64 = rest.parse().ok()?;
            if n == -1 { return Some(RespValue::Nil); }
            let mut buf = vec![0u8; n as usize];
            reader.read_exact(&mut buf).ok()?;
            let mut crlf = [0u8; 2];
            reader.read_exact(&mut crlf).ok()?;  // discard \r\n
            Some(RespValue::Bulk(buf))
        }
        "*" => {
            let count: i64 = rest.parse().ok()?;
            if count == -1 { return Some(RespValue::Nil); }
            let elems = (0..count).filter_map(|_| read_value(reader)).collect();
            Some(RespValue::Array(elems))
        }
        _ => None,
    }
}
```

`read_line` appends to the string and includes `\n` (and `\r` if present). Always `trim_end_matches` before parsing the value. `read_exact` for the bulk body does **not** consume the trailing `\r\n` — read 2 more bytes explicitly after the body.
