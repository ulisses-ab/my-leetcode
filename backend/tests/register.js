import fs from "fs";

const url = "http://localhost:3030/api/auth/register";

async function main() {
  const payload = {
    handle: "Test User",
    email: "test@example.com",
    password: "123456"
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log("Response:", data);

  fs.writeFileSync("tests/token.txt", data.token);
}

main().catch(console.error);
