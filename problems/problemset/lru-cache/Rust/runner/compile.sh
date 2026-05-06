#!/bin/bash
set -e
cp runner/testbench.rs build/testbench.rs
cp code/lru_cache.rs build/lru_cache.rs
mkdir -p build/lru_cache
for f in code/*.rs; do
    fname=$(basename "$f")
    [ "$fname" = "lru_cache.rs" ] && continue
    cp "$f" "build/lru_cache/$fname"
done
/usr/local/cargo/bin/rustc --edition 2021 build/testbench.rs -o build/program.out
