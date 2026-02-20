# Build a Simple REST API

## Overview

You are asked to build a **RESTful API** for managing users and their tasks.  
The goal is to evaluate your ability to design APIs, structure code, handle edge cases, and write clean, maintainable logic.

You may use **any programming language or framework**, but the API must follow the specification below.

---

## Requirements

### Entities

#### User
- `id` (string, unique)
- `name` (string)
- `email` (string, unique)
- `created_at` (ISO 8601 timestamp)

#### Task
- `id` (string, unique)
- `user_id` (string)
- `title` (string)
- `completed` (boolean)
- `created_at` (ISO 8601 timestamp)

---

## API Endpoints

### Users

#### Create User
