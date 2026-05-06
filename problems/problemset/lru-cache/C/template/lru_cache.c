#include <stdlib.h>
#include "LRUCache.h"

struct LRUCache {
    int capacity;
    /* add your fields here */
};

LRUCache *lru_create(int capacity) {
    LRUCache *c = malloc(sizeof(*c));
    c->capacity = capacity;
    return c;
}

int lru_get(LRUCache *c, int key) {
    /* TODO */
    (void)c; (void)key;
    return -1;
}

void lru_put(LRUCache *c, int key, int value) {
    /* TODO */
    (void)c; (void)key; (void)value;
}

void lru_destroy(LRUCache *c) {
    free(c);
}
