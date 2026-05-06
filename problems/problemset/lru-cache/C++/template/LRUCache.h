#pragma once
#include <bits/stdc++.h>

class LRUCache {
public:
    LRUCache(int capacity);
    int  get(int key);
    void put(int key, int value);
private:
    // Add your fields here
};
