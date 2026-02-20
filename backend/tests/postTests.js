import fs from "fs";

const url = "http://localhost:3030/api/problems/081b6655-a486-41fd-b738-54cca06e1a56/tests";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: node postTests.js <path-to-json-file>");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath);
  const fileName = filePath.split("/").pop() || "tests.json";

  const formData = new FormData();
  const blob = new Blob([fileContent], { type: "application/json" });
  formData.append("file", blob, fileName);

  const token = fs.readFileSync("tests/token.txt", "utf-8").trim();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", data);
}

main().catch(console.error);
