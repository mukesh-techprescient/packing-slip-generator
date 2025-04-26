const API_BASE_URL = "https://packingslip-api.onrender.com/slips";

// API: List all slips
export async function listSlips() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch slips");
  return response.json();
}

// API: Get slip by ID
export async function getSlip(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Slip not found");
  return response.json();
}

// API: Create new slip
export async function createSlip(slip) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slip),
  });
  if (!response.ok) throw new Error("Failed to create slip");
  return response.json();
}

// API: Update slip by ID
export async function updateSlip(slipData) {
  const response = await fetch(`${API_BASE_URL}/${slipData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slipData),
  });
  if (!response.ok) throw new Error("Failed to update slip");
  return response.json();
}

// API: Delete slip by ID
export async function deleteSlip(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete slip");
  return response.json();
}
