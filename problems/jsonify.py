import sys
import json

str = sys.stdin.read()

with open("tests.json", "r") as f:
    testsObj = json.loads(f.read())
    print(testsObj)

    testsObj["testcases"][13]["output"] = str

with open("tests.json", "w") as f: 
    f.write(json.dumps(testsObj, indent=2))