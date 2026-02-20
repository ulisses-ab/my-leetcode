import fs from "fs";

const baseUrl = "http://localhost:3030/api/problems";

async function main() {
  const problemId = "081b6655-a486-41fd-b738-54cca06e1a56";
  const setupId = null;

  if (!problemId) {
    console.error("Usage: node getTests.js <problemId> [setupId]");
    console.error("  - problemId: required");
    console.error("  - setupId: optional (if not provided, returns default tests)");
    process.exit(1);
  }

  const url = setupId 
    ? `${baseUrl}/${problemId}/setups/${setupId}/tests`
    : `${baseUrl}/${problemId}/tests`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(data, null, 2));
}

main().catch(console.error);

