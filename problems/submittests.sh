TOKEN=$(<token.txt)
SETUP=$(<setup.txt)
PROBLEM=$(<problem.txt)

curl -X POST "http://localhost:3030/api/problems/$PROBLEM/setups/$SETUP/tests" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@tests.json"