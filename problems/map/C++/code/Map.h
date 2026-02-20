#include <bits/stdc++.h>

#include <map>

class Map {
public:
    // You must implement the following public methods:

    void set(const std::string& key, const std::string& val) {
        long long int h = hash(key);

        for (auto &pair : data[h]) {
            if (pair.first == key) {
                pair.second = val;
                return;
            }
        }

        size_++;
        data[h].push_back({key, val});
    };

    std::string get(const std::string& key) {
        long long int h = hash(key);

        for (const auto &pair: data[h]) {
            if (pair.first == key) return pair.second;
        }

        return "";
    };

    int size() {
        return size_;
    };
private:
    // Add private state or methods here:

    static const int HASH_SIZE = 60000;

    long long int hash(const std::string& key) {
        const long long int MOD = 483;
        long long int hash = 0;

        for (auto c : key) {
            hash *= MOD;
            hash %= HASH_SIZE;
            hash += c;
        }

        return hash;
    };

    int size_ = 0;
    std::vector<std::pair<std::string, std::string>> data[HASH_SIZE];
};