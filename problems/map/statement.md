Implement a simple Map class that stores key-value pairs, where both keys and values are strings containing only lowercase English letters. The class should support the following operations:

1. ```set(key, val)``` – Stores the value ```val``` for the ```key``` key. If the key already exists, update its value.
2. ```get(key)``` – Returns the value associated with the ```key``` key. If the key does not exist, return an empty string ```""```.
3. ```size()``` – Returns the number of key-value pairs currently stored in the map.

## Constraints

* Keys and values are lowercase English letters only.
* Keys and values have a maximum length of 10 characters.
* There will be at most 10<sup>5</sup> operations.


## Example:

```py
m = Map()

m.set("apple", "fruit")
m.set("car", "vehicle")
print(m.get("apple"))  # Output: "fruit"
print(m.get("banana")) # Output: ""
print(m.size())        # Output: 2

m.set("apple", "tech")
print(m.get("apple"))  # Output: "tech"
print(m.size())        # Output: 2
```
