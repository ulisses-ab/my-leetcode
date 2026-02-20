import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import archiver from "archiver";
import { PassThrough } from "stream";

const baseURL = "http://localhost:3030/api/problems";

const token = fs.readFileSync("tests/token.txt", "utf-8").trim();
const apiClient = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export function zipFolder(folderPath) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const passThrough = new PassThrough();

  archive.directory(folderPath, false);
  archive.finalize();
  archive.pipe(passThrough);

  return passThrough;
}

async function submitProblem(folderPath) {
  try {
    const infoPath = path.join(folderPath, "info.json");
    const statementPath = path.join(folderPath, "statement.md");

    if (!fs.existsSync(infoPath) || !fs.existsSync(statementPath)) {
      throw new Error("info.json or statement.md is missing in the folder");
    }

    const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));
    const statement = fs.readFileSync(statementPath, "utf8");

    const payload = {
      title: info.title,
      description: info.description,
      difficulty: info.difficulty,
      statement,
    };

    // Submit problem using axios
    const res = await apiClient.post("", payload); // empty string, baseURL already points to /problems
    console.log("Problem submitted:", res.data);

    const problemId = res.data.problem.id;

    // Submit tests
    await submitTests(folderPath, problemId);
    await submitSetups(folderPath, problemId)
  } catch (error) {
    console.error("Error submitting problem:", error.response?.data || error.message);
  }
}

async function submitTests(folderPath, problemId) {
  const testsFilePath = path.join(folderPath, "tests.json");

  if (!fs.existsSync(testsFilePath)) {
    throw new Error("tests.json not found in folder");
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(testsFilePath));

  try {
    const response = await apiClient.post(
      `/${problemId}/tests`,
      formData,
      {
        headers: {
          ...formData.getHeaders(), // multipart headers
        },
      }
    );

    console.log("Tests uploaded successfully:", response.data);
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
  }
}

async function submitSetups(folderPath, problemId) {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  const setupFolders = entries.filter((entry) => entry.isDirectory());

  for (const setupFolder of setupFolders) {
    const language = setupFolder.name;
    const setupPath = path.join(folderPath, language);
    const infoPath = path.join(setupPath, "info.txt");

    let info = "";
    if (fs.existsSync(infoPath)) {
      info = fs.readFileSync(infoPath, "utf-8");
    }

    let setupId;
    try {
      const response = await apiClient.post(`/${problemId}/setups`, {
        language,
        info,
      });
      setupId = response.data.id || response.data.setup?.id; // adjust depending on API
      console.log(`Setup for ${language} created:`, response.data);
    } catch (error) {
      console.error(
        `Failed to create setup for ${language}:`,
        error.response?.data || error.message
      );
      continue
    }

    // Upload runner and template zips
    const runnerPath = path.join(setupPath, "runner");
    const templatePath = path.join(setupPath, "template");

    const uploads = [
      { folder: runnerPath, type: "runner" },
      { folder: templatePath, type: "template" },
    ];

    for (const { folder, type } of uploads) {
      if (!fs.existsSync(folder)) continue;

      const formData = new FormData();
      formData.append("file", zipFolder(folder), {
        filename: `${type}.zip`,
      });

      try {
        const res = await apiClient.post(
          `/${problemId}/setups/${setupId}/${type}`,
          formData,
          { headers: formData.getHeaders() }
        );
        console.log(`${type} uploaded for ${language}:`, res.data);
      } catch (error) {
        console.error(
          `Failed to upload ${type} for ${language}:`,
          error.response?.data || error.message
        );
      }
    }
  }
}

const folderPath = process.argv[2];
if (!folderPath) {
  console.error("Please provide the path to the folder containing the problem files.");
  process.exit(1);
}

submitProblem(folderPath);
