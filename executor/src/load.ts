import { api } from "./infra/api";
import { S3ObjectStorageService } from "./infra/S3ObjectStorageService";
import { s3 } from "./infra/s3";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import axiosRetry from "axios-retry";

import dotenv from "dotenv";
dotenv.config();

const objectStorageService = new S3ObjectStorageService(s3, process.env.S3_BUCKET_NAME!);

axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        const status = error.response?.status;

        return !!(
            axiosRetry.isNetworkError(error) ||
            status === 404 ||
            (status && status >= 500)
        );
    },
});

async function fetchExecutionFiles(submissionId: string) {
    const response = await api.get(`/submissions/${submissionId}/execution-files`);

    const codeFile = await objectStorageService.download(response.data.codeFileKey);
    const runnerFile = await objectStorageService.download(response.data.runnerFileKey);
    const testsFile = await objectStorageService.download(response.data.testsFileKey);

    return {
        submission: response.data.submission,
        codeFile,
        runnerFile,
        testsFile,
    }
}

function makeExecutionDir(submissionId: string) {
    const baseDir = `./tmp/${submissionId}`;

    fs.mkdirSync(baseDir, { recursive: true });
    fs.mkdirSync(`${baseDir}/code`, { recursive: true });
    fs.mkdirSync(`${baseDir}/runner`, { recursive: true });
    fs.mkdirSync(`${baseDir}/build`, { recursive: true });
    fs.mkdirSync(`${baseDir}/input`, { recursive: true });

    return baseDir;
}

async function saveFiles(baseDir: string, files: any) {
    const code = new AdmZip(files.codeFile);
    const runner = new AdmZip(files.runnerFile);

    code.extractAllTo(`${baseDir}/code`, true);
    runner.extractAllTo(`${baseDir}/runner`, true);

    fs.writeFileSync(`${baseDir}/tests.json`, files.testsFile);
}

export async function load(id: string) {
    try {
        const baseDir = makeExecutionDir(id);
        const files = await fetchExecutionFiles(id);
        await saveFiles(baseDir, files);
        return baseDir;
    } catch (error: any) {
        console.error("Preparation error", error);
    }
}
