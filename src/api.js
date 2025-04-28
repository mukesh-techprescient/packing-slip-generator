const useLocalStorageAPI = false; // 👈 Toggle this

import * as localAPI from "./mockApi";
import * as realAPI from "./slipsApi";

const api = useLocalStorageAPI ? localAPI : realAPI;

// re-export individually
export const createSlip = api.createSlip;
export const listSlips = api.listSlips;
export const getSlip = api.getSlip;
export const updateSlip = api.updateSlip;
export const deleteSlip = api.deleteSlip;
export const getFirms = api.getFirms;
export const getLastSlipNumber = api.getLastSlipNumber;


