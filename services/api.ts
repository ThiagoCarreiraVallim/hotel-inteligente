import axios from "axios";

// Python API - Excel processing, AI, campaigns (10% traffic)
const PYTHON_API_URL =
  process.env.NEXT_PUBLIC_PYTHON_API_URL ||
  (typeof window !== "undefined" && window.location.hostname.includes("fly.dev")
    ? "https://hotel-inteligente.fly.dev"
    : "http://localhost:8000");

// Go API - High-performance profile queries (90% traffic)
const GO_API_URL =
  process.env.NEXT_PUBLIC_GO_API_URL ||
  (typeof window !== "undefined" && window.location.hostname.includes("fly.dev")
    ? "https://hotel-inteligente-go.fly.dev"
    : "http://localhost:8000");

// Python API client - for uploads, campaigns, AI processing
const pythonApi = axios.create({
  baseURL: PYTHON_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Go API client - for fast profile queries
const goApi = axios.create({
  baseURL: GO_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// PYTHON API - Excel Processing & Campaigns
// ============================================================================

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${PYTHON_API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getSegments = async (sessionId: string) => {
  const response = await pythonApi.get(`/segmentos/${sessionId}`);
  return response.data;
};

export const getTemplate = async (segmentoId: string) => {
  const response = await pythonApi.get(`/template/${segmentoId}`);
  return response.data;
};

export const exportCampaign = async (sessionId: string, segmentoId: string) => {
  const response = await axios.get(
    `${PYTHON_API_URL}/exportar/${sessionId}/${segmentoId}`,
    {
      responseType: "blob",
    }
  );

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `campanha_${segmentoId}_${sessionId}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  return true;
};

export const getStats = async (sessionId: string) => {
  const response = await pythonApi.get(`/stats/${sessionId}`);
  return response.data;
};

// ============================================================================
// GO API - High-Performance Profile Queries
// ============================================================================

export const getProfiles = async (limit: number = 100, offset: number = 0) => {
  const response = await goApi.get("/profiles", {
    params: { limit, offset },
  });
  return response.data;
};

export const getProfileById = async (phoneId: string) => {
  const response = await goApi.get(`/profiles/${phoneId}`);
  return response.data;
};

export const getProfilesByProfession = async (
  profession: string,
  limit: number = 100
) => {
  const response = await goApi.get(`/profiles/profession/${profession}`, {
    params: { limit },
  });
  return response.data;
};

export const getProfilesByLocation = async (
  state: string,
  city?: string,
  limit: number = 100
) => {
  const response = await goApi.get(`/profiles/location`, {
    params: { state, city, limit },
  });
  return response.data;
};

export const getProfileAnalytics = async () => {
  const response = await goApi.get("/profiles/analytics");
  return response.data;
};

// Health checks
export const checkPythonHealth = async () => {
  const response = await pythonApi.get("/");
  return response.data;
};

export const checkGoHealth = async () => {
  const response = await goApi.get("/health");
  return response.data;
};

export const getEvents = async () => {
  const response = await goApi.get("/events");
  return response.data;
};

export const createEvent = async (eventData: Event) => {
  const response = await goApi.post("/events", eventData);
  return response.data;
};

export const uploadEventFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${GO_API_URL}/events/import`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getEventById = async (id: string) => {
  const response = await goApi.get(`/events/${id}`);
  return response.data;
};

export const updateEvent = async (id: string, eventData: Event) => {
  const response = await goApi.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await goApi.delete(`/events/${id}`);
  return response.data;
};

export const getCampaigns = async () => {
  const response = await goApi.get("/campaigns");
  return response.data;
};

export const getCampaign = async (id: string) => {
  const response = await goApi.get(`/campaigns/${id}`);
  return response.data;
};

export { pythonApi, goApi };
export default pythonApi;
