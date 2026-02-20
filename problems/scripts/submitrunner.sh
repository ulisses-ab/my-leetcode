TOKEN=$(<token.txt)

curl -X POST "http://localhost:3030/api/problems/f84e8fe3-5d70-43a7-8e9c-54fde94ff987/setups/eb98d427-0ce5-48e0-92fa-8ec35bc4f3c8/runner" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@runner.zip"