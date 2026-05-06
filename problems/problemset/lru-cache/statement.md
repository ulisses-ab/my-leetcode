Implement an **LRU (Least Recently Used) Cache**.

An LRU cache is a fixed-capacity store that evicts the **least recently used** item when it runs out of space. Both `get` and `put` count as a use — accessing a key makes it the most recently used.

Implement an `LRUCache` class with:

- `LRUCache(int capacity)` — maximum number of key-value pairs the cache can hold.
- `int get(int key)` — return the value associated with `key`, or `-1` if it is not present. Counts as a use.
- `void put(int key, int value)` — insert or update `key` with `value`. If inserting a new key would exceed capacity, evict the least recently used key first. Counts as a use.

Both operations must run in **O(1)** average time.

## Example

```
LRUCache cache(2);

cache.put(1, 1);   // cache: {1=1}
cache.put(2, 2);   // cache: {1=1, 2=2}
cache.get(1);      // 1   — key 1 is now MRU; cache order: [2, 1]
cache.put(3, 3);   // evicts key 2 (LRU); cache: {1=1, 3=3}
cache.get(2);      // -1  — was evicted
cache.get(1);      // 1
cache.get(3);      // 3
```

## Constraints

- `1 <= capacity <= 3000`
- `0 <= key <= 10000`
- `0 <= value <= 100000`
- At most `200000` calls to `get` and `put` combined
