import fs from "fs";

const url = "http://localhost:3030/api/problems/dc3a0d89-7846-4f02-b238-153a517abb17/setups";

async function main() {
  const payload = {
    language: "Java",
    runnerId: "aura",
    info: "",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${fs.readFileSync("tests/token.txt", "utf-8")}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log("Response:", data);
}

main().catch(console.error);
