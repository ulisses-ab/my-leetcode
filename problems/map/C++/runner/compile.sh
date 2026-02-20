#!/bin/bash
set -e

# Directories to scan
SRC_DIRS="runner code"

# Forbidden STL containers
FORBIDDEN_TYPES=("map<" "unordered_map<" "set<" "unordered_set<")

# Check for forbidden types
for type in "${FORBIDDEN_TYPES[@]}"; do
    if grep -r -n -F --include="*.cpp" --include="*.h" "$type" $SRC_DIRS >/dev/null; then
        echo "Error: Forbidden container '$type' detected in source files!"
        grep -r -n -F --include="*.cpp" --include="*.h" "$type" $SRC_DIRS
        exit 1
    fi
done

g++ -std=c++20 $(find runner/ code/ -name "*.cpp") -o build/program.out