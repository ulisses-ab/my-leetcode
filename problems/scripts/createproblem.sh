TOKEN=$(<token.txt)

STATEMENT=$(<map/statement.md)

curl -X POST http://localhost:3030/api/problems \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$(jq -n \
            --arg title "Design a Map" \
            --arg statement "$STATEMENT" \
            --arg difficulty "EASY" \
            '{title: $title, statement: $statement, difficulty: $difficulty}')"