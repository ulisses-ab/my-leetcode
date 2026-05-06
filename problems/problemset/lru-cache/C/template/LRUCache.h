#ifndef LRU_CACHE_H
#define LRU_CACHE_H

typedef struct LRUCache LRUCache;

LRUCache *lru_create(int capacity);
int       lru_get(LRUCache *c, int key);      /* -1 if not found */
void      lru_put(LRUCache *c, int key, int value);
void      lru_destroy(LRUCache *c);

#endif
