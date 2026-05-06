#pragma once
#include <bits/stdc++.h>

class LRUCache {
    int cap;
    list<pair<int,int>> lst;
    unordered_map<int, list<pair<int,int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        auto it = mp.find(key);
        if (it == mp.end()) return -1;
        lst.splice(lst.begin(), lst, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = mp.find(key);
        if (it != mp.end()) {
            lst.splice(lst.begin(), lst, it->second);
            it->second->second = value;
        } else {
            if ((int)lst.size() == cap) {
                mp.erase(lst.back().first);
                lst.pop_back();
            }
            lst.emplace_front(key, value);
            mp[key] = lst.begin();
        }
    }
};
