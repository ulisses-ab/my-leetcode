TOKEN=$(<token.txt)

curl -X POST http://localhost:3030/api/problems/f84e8fe3-5d70-43a7-8e9c-54fde94ff987/setups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ 
    "language": "C++",
    "info": "Compilation info: All .cpp files in the workspace will be compiled together using g++."
  }'