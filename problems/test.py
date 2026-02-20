import sys

def main():
    store = {}

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        parts = line.split()

        cmd = parts[0]

        if cmd == "SET":
            # SET key value
            if len(parts) >= 3:
                key = parts[1]
                value = parts[2]
                store[key] = value

        elif cmd == "GET":
            # GET key
            if len(parts) >= 2:
                key = parts[1]
                print(store.get(key, "\"\""))

        elif cmd == "SIZE":
            print(len(store))

if __name__ == "__main__":
    main()
