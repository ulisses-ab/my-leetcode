import fs from "fs";

const url = "http://localhost:3030/api/problems";

async function main() {
  const payload = {
    title: "Two Sum",
    statement: fs.readFileSync("tests/markdown.md", "utf8"),
    difficulty: "HARD",
    description: "Given an array of integers `nums` and an integer `target`, return **indices of the two numbers** such that they add up to `target`.",
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
