import { apiFetch } from "./api";

const fetchLiveTLEs = async () => {
    try {
        const payload = await apiFetch("/api/satellites");
        return payload.data ?? [];
    } catch (error) {
        console.error("Failed to fetch live satellites from the API:", error);
        return [];
    }
};

export default fetchLiveTLEs;
