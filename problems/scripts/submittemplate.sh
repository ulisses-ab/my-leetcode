TOKEN=$(<token.txt)

PROBLEM=$(<problem.txt)
SETUP=$(<setup.txt)

curl -X POST "http://localhost:3030/api/problems/$PROBLEM/setups/$SETUP/template" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@template.zip"