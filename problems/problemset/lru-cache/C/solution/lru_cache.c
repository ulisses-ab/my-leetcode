#include <stdlib.h>
#include "LRUCache.h"

#define MAX_KEY 10001

typedef struct Node {
    int key, value;
    struct Node *prev, *next;
} Node;

struct LRUCache {
    int   capacity, size;
    Node *head, *tail;       /* sentinels: head→MRU side, tail→LRU side */
    Node *map[MAX_KEY];
};

static void detach(Node *n) {
    n->prev->next = n->next;
    n->next->prev = n->prev;
}

static void insert_front(LRUCache *c, Node *n) {
    n->next = c->head->next;
    n->prev = c->head;
    c->head->next->prev = n;
    c->head->next = n;
}

LRUCache *lru_create(int capacity) {
    LRUCache *c = calloc(1, sizeof(*c));
    c->capacity = capacity;
    c->head = calloc(1, sizeof(Node));
    c->tail = calloc(1, sizeof(Node));
    c->head->next = c->tail;
    c->tail->prev = c->head;
    return c;
}

int lru_get(LRUCache *c, int key) {
    Node *n = c->map[key];
    if (!n) return -1;
    detach(n);
    insert_front(c, n);
    return n->value;
}

void lru_put(LRUCache *c, int key, int value) {
    Node *n = c->map[key];
    if (n) {
        n->value = value;
        detach(n);
        insert_front(c, n);
        return;
    }
    if (c->size == c->capacity) {
        Node *lru = c->tail->prev;
        detach(lru);
        c->map[lru->key] = NULL;
        free(lru);
        c->size--;
    }
    n = malloc(sizeof(Node));
    n->key = key;
    n->value = value;
    insert_front(c, n);
    c->map[key] = n;
    c->size++;
}

void lru_destroy(LRUCache *c) {
    Node *cur = c->head->next;
    while (cur != c->tail) {
        Node *next = cur->next;
        free(cur);
        cur = next;
    }
    free(c->head);
    free(c->tail);
    free(c);
}
