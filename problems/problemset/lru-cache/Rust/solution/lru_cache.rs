use std::collections::HashMap;

pub struct LRUCache {
    capacity: usize,
    map: HashMap<i32, i32>,
    order: Vec<i32>,
}

impl LRUCache {
    pub fn new(capacity: i32) -> Self {
        Self {
            capacity: capacity as usize,
            map: HashMap::new(),
            order: Vec::new(),
        }
    }

    pub fn get(&mut self, key: i32) -> i32 {
        if let Some(&val) = self.map.get(&key) {
            self.touch(key);
            val
        } else {
            -1
        }
    }

    pub fn put(&mut self, key: i32, value: i32) {
        if self.map.contains_key(&key) {
            self.touch(key);
            self.map.insert(key, value);
        } else {
            if self.map.len() == self.capacity {
                let lru = self.order.remove(0);
                self.map.remove(&lru);
            }
            self.map.insert(key, value);
            self.order.push(key);
        }
    }

    fn touch(&mut self, key: i32) {
        if let Some(pos) = self.order.iter().position(|&k| k == key) {
            self.order.remove(pos);
        }
        self.order.push(key);
    }
}
