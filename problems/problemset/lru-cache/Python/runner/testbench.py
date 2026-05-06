import sys
import json
import time
import resource

sys.path.insert(0, '/workspace/code')
from lru_cache import LRUCache

def main():
    testcase = json.loads(sys.stdin.read())

    cache = None
    output_lines = []

    start = time.perf_counter()

    for line in testcase['input'].splitlines():
        parts = line.split()
        if not parts:
            continue
        cmd = parts[0]
        if cmd == 'INIT':
            cache = LRUCache(int(parts[1]))
        elif cmd == 'GET':
            output_lines.append(str(cache.get(int(parts[1]))))
        elif cmd == 'PUT':
            cache.put(int(parts[1]), int(parts[2]))

    elapsed_ms = (time.perf_counter() - start) * 1000
    memory_kb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

    actual_output = '\n'.join(output_lines) + '\n' if output_lines else ''

    result = {
        'actual_output': actual_output,
        'time_ms': elapsed_ms,
        'memory_kb': memory_kb,
    }

    sys.stdout.write(f'__BEGIN_RESULT__{json.dumps(result)}__END_RESULT__')

main()
