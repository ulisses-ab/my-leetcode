if [ $# -ne 3 ]; then
    echo "Usage: $0 <solution_folder_path> <tests_file_path> <results_file_path>"
    exit 1
fi

SOLUTION_FOLDER="$1"
TESTS_FILE_PATH="$2"
RESULTS_FILE_PATH="$3"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

python3 "$SCRIPT_DIR/tester.py" "$SOLUTION_FOLDER" "$TESTS_FILE_PATH" "$RESULTS_FILE_PATH"

