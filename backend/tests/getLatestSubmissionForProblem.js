import fs from "fs";

const url = "http://localhost:3030/api/problems/dc3a0d89-7846-4f02-b238-153a517abb17/submissions/latest";

async function main() {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${fs.readFileSync("tests/token.txt", "utf-8")}`
    },
  });

  const data = await res.json();
  console.log("Response:", data);
}

main().catch(console.error);
