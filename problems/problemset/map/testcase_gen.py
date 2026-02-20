import random
import string
import json
import os

def random_string(min_len=1, max_len=10):
    length = random.randint(min_len, max_len)
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def generate_testcase(num_ops=10):
    keys = []
    input_lines = []
    expected_outputs = []

    for _ in range(num_ops):
        op_type = random.choices(["SET", "GET", "SIZE"], weights=[0.5, 0.4, 0.1])[0]

        if op_type == "SET":
            key = random_string()
            val = random_string()
            input_lines.append(f"SET {key} {val}")
            keys.append((key, val))
        elif op_type == "GET":
            if keys and random.random() < 0.7:
                key, val = random.choice(keys)
                input_lines.append(f"GET {key}")
                expected_outputs.append(val)
            else:
                key = random_string()
                input_lines.append(f"GET {key}")
                expected_outputs.append('""')
        elif op_type == "SIZE":
            unique_keys = {k for k, _ in keys}
            input_lines.append("SIZE")
            expected_outputs.append(str(len(unique_keys)))

    # Some extra GETs for non-existent keys
    for _ in range(random.randint(0, 3)):
        key = random_string()
        input_lines.append(f"GET {key}")
        expected_outputs.append('""')

    input_str = "\n".join(input_lines) + "\n"
    output_str = "\n".join(expected_outputs) + "\n"

    return {"input": input_str, "output": output_str}

def append_testcases_to_file(filename="tests.json", num_new=10):
    # Load existing testcases if file exists
    if os.path.exists(filename):
        with open(filename, "r") as f:
            data = json.load(f)
        if "testcases" not in data:
            data["testcases"] = []
    else:
        data = {"testcases": []}

    # Generate new testcases
    for _ in range(num_new):
        num_ops = random.randint(50000, 100000)  # can increase for bigger tests
        data["testcases"].append(generate_testcase(num_ops))

    # Save back to file
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

# Example usage
if __name__ == "__main__":
    append_testcases_to_file(num_new=2)
    print("Appended 20 new testcases to tests.json")
