#!/usr/bin/env python3
"""
Tester script for two-sum problem.
Tests a user's solution against all test cases and generates results.json
"""

import sys
import json
import importlib.util
from pathlib import Path
from typing import List, Dict, Any


def load_solution(solution_folder: str) -> Any:
    """Load the Solution class from solution.py in the given folder."""
    solution_path = Path(solution_folder) / "solution.py"
    
    if not solution_path.exists():
        raise FileNotFoundError(f"solution.py not found in {solution_folder}")
    
    spec = importlib.util.spec_from_file_location("solution", solution_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load solution.py from {solution_folder}")
    
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    
    if not hasattr(module, "Solution"):
        raise AttributeError("Solution class not found in solution.py")
    
    return module.Solution


def load_test_cases(tests_path: str) -> List[Dict[str, Any]]:
    with open(tests_path, 'r') as f:
        data = json.load(f)
    
    return data.get("testcases", [])


def normalize_output(output: List[int]) -> List[int]:
    """Normalize output to ensure consistent ordering for comparison."""
    return sorted(output)


def test_solution(solution_folder: str, test_path: str) -> Dict[str, Any]:
    """Test the solution against all test cases."""
    try:
        Solution = load_solution(solution_folder)
        test_cases = load_test_cases(test_path)
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "results": []
        }
    
    solution = Solution()
    results = []
    all_passed = True
    
    for i, test_case in enumerate(test_cases):
        test_input = test_case["input"]
        expected_output = test_case["output"]
        
        result = {
            "testcase": i + 1,
            "passed": False,
            "error": None,
            "actual_output": None
        }
        
        try:
            # Call the twoSum method
            actual_output = solution.twoSum(
                test_input["nums"],
                test_input["target"]
            )
            
            result["actual_output"] = actual_output
            
            # Check if output is valid
            if not isinstance(actual_output, list) or len(actual_output) != 2:
                result["error"] = f"Invalid output format. Expected list of 2 integers, got {type(actual_output)}"
                all_passed = False
            else:
                # Check if indices are valid
                idx1, idx2 = actual_output
                if not (0 <= idx1 < len(test_input["nums"]) and 
                        0 <= idx2 < len(test_input["nums"]) and
                        idx1 != idx2):
                    result["error"] = "Invalid indices in output"
                    all_passed = False
                else:
                    # Check if the sum matches target
                    sum_value = test_input["nums"][idx1] + test_input["nums"][idx2]
                    if sum_value == test_input["target"]:
                        # Check if output matches expected (order doesn't matter)
                        normalized_actual = normalize_output(actual_output)
                        normalized_expected = normalize_output(expected_output)
                        if normalized_actual == normalized_expected:
                            result["passed"] = True
                        else:
                            result["error"] = f"Output indices don't match expected. Got {actual_output}, expected {expected_output}"
                            all_passed = False
                    else:
                        result["error"] = f"Sum doesn't match target. {test_input['nums'][idx1]} + {test_input['nums'][idx2]} = {sum_value}, expected {test_input['target']}"
                        all_passed = False
        
        except Exception as e:
            result["error"] = str(e)
            all_passed = False
        
        results.append(result)
    
    return {
        "success": all_passed,
        "total_tests": len(test_cases),
        "passed_tests": sum(1 for r in results if r["passed"]),
        "failed_tests": sum(1 for r in results if not r["passed"]),
        "results": results
    }


def main():
    solution_folder = sys.argv[1]
    test_path = sys.argv[2]
    results_path = sys.argv[3]

    results = test_solution(solution_folder, test_path)
    
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Print summary
    if results["success"]:
        print(f"✓ All {results['total_tests']} tests passed!")
    else:
        print(f"✗ {results['failed_tests']} out of {results['total_tests']} tests failed")
        print(f"Results written to {results_path}")
    
    sys.exit(0 if results["success"] else 1)


if __name__ == "__main__":
    main()

