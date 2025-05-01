const SLIP_API_BASE_URL = "https://packingslip-api.onrender.com/slips";
const API_BASE_URL = "https://packingslip-api.onrender.com";

// Replace with your method of getting the Google Auth token
const getGoogleAuthToken = () => {
  // Implement your logic to retrieve the token, e.g., from localStorage or context
  return localStorage.getItem('googleAuthToken'); // Example using localStorage
}

// Helper function to create headers with Google Auth token
const createAuthHeaders = () => {
  const token = getGoogleAuthToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

// API: List all slips with pagination and search
export async function listSlips({ page, per_page, search }) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    search: search || '',  // Handle if search is undefined or empty
  });

  const response = await fetch(`${SLIP_API_BASE_URL}?${queryParams}`, {
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch slips");
  }

  return response.json();
}



// API: Get slip by ID
export async function getSlip(id) {
  const response = await fetch(`${SLIP_API_BASE_URL}/${id}`, {
    headers: createAuthHeaders(),
  });
  if (!response.ok) throw new Error("Slip not found");
  return response.json();
}

// API: Create new slip
export async function createSlip(slip) {
  const response = await fetch(SLIP_API_BASE_URL, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify(slip),
  });
  if (!response.ok) throw new Error("Failed to create slip");
  return response.json();
}

// API: Update slip by ID
export async function updateSlip(slipData) {
  const response = await fetch(`${SLIP_API_BASE_URL}/${slipData.id}`, {
    method: "PUT",
    headers: createAuthHeaders(),
    body: JSON.stringify(slipData),
  });
  if (!response.ok) throw new Error("Failed to update slip");
  return response.json();
}

// API: Delete slip by ID
export async function deleteSlip(id) {
  const response = await fetch(`${SLIP_API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: createAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete slip");
  return response.json();
}

export const getFirms = async () => {
  const response = await fetch(`${API_BASE_URL}/firms`, {
    headers: createAuthHeaders(),
  });
  return await response.json();
};

// API: Get last slip number
export const getLastSlipNumber = async () => {
  const response = await fetch(`${API_BASE_URL}/last-slip-number`, {
    headers: createAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch last slip number");
  return await response.json();
};