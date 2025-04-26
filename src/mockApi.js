
const STORAGE_KEY = "packingSlips";

// Helper: Load slips from localStorage
function loadSlips() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Helper: Save slips to localStorage
export function saveSlip(slips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slips));
}

// API: List all slips
export function listSlips() {
  return new Promise((resolve) => {
    const slips = loadSlips();
    setTimeout(() => resolve(slips), 300); // simulate API delay
  });
}

// API: Get slip by ID
export function getSlip(id) {
  return new Promise((resolve, reject) => {
    const slips = loadSlips();
    console.log(slips);
    console.log(id);
    const slip = slips.find((s) => String(s.id) === String(id));
    setTimeout(() => {
      slip ? resolve(slip) : reject(new Error("Slip not found"));
    }, 300);
  });
}

// API: Save new slip
export function createSlip(slip) {
  return new Promise((resolve) => {
    const slips = loadSlips();
    const newSlip = { ...slip, id: Date.now() }; // Auto-generate ID
    slips.push(newSlip);
    saveSlip(slips);
    setTimeout(() => resolve(newSlip), 300);
  });
}

// API: Update existing slip
export function updateSlip(slipData) {
  return new Promise((resolve, reject) => {
    const slips = loadSlips();
    const index = slips.findIndex((s) => String(s.id) === String(slipData.id));
    if (index === -1) {
      return reject(new Error("Slip not found"));
    }
    slips[index] = slipData;
    saveSlip(slips);
    setTimeout(() => resolve(slipData), 300);
  });
}



// Delete a slip by ID
export async function deleteSlip(id) {
    const slips = await listSlips();
    const updated = slips.filter((slip) => slip.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

// API: Insert dummy data (optional helper)
export function insertDummyData() {
  const dummySlips = [
    {
      id: 1714125213871,
      firmName: "Sujata Trading Company",
      customerName: "AXYZ Ltd Ltd",
      designNo: "D-001",
      date: "2025-04-25",
      wayBillNo: "WB-101",
      setNo: "Set-01",
      totalTaga: 3,
      totalQty: 500,
      packages: [
        {
          packageNumber: "STC-001",
          items: [
            { itemName: "Cotton", taga: 1, qty: 200 },
            { itemName: "Silk", taga: 1, qty: 300 },
            
          ]
        }
      ]
    },
    {
        id: 1714125213872,
        firmName: "Sujata Trading Company",
        customerName: "AXYZ Ltd Ltd",
        designNo: "D-002",
        date: "2025-04-20",
        wayBillNo: "WB-102",
        setNo: "Set-01",
        totalTaga: 3,
        totalQty: 600,
        packages: [
          {
            packageNumber: "STC-002",
            items: [
              { itemName: "Cotton", taga: 1, qty: 200 },
              { itemName: "Silk", taga: 1, qty: 300 },
              { itemName: "satin", taga: 1, qty: 100 }
              
            ]
          }
        ]
      }
  ];
  saveSlip(dummySlips);
}
