import { api } from "./infra/api";

export async function submit(submissionId: string, results: any) {
    console.log("SUBMITTING");
    
    try {
        const formData = new FormData();

        formData.append('file', new Blob([JSON.stringify(results)]));
        formData.append('status', results?.status ?? "FAILED");

        const res = await api.post(`/submissions/${submissionId}/results`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error: any) {
        console.error("Failed to submit results:", error);
    }
}