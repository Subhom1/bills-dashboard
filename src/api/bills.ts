import axios from "axios";
import { mockBills } from "@/tests/mocks/mockBills";
import { Bill } from "@/types";
import { API_CONFIG } from "./config";
import { API_ENDPOINTS } from "@/constants/index";
import { debounce } from 'lodash';

/**
 * Interface representing the structure of the bills API response
 * Contains metadata in the head object and an array of bill results
 * @interface BillsResponse
 */
interface BillsResponse {
  head: {
    counts: {
      billCount: number; // Total number of bills in the database
      resultCount: number; // Number of bills in current response
    };
    dateRange: {
      start: string; // Start date of the query range
      end: string; // End date of the query range
    };
    lang: string; // Response language code
  };
  results: {
    bill: Bill; // Array of bill objects
  }[];
}

/**
 * Axios instance with predefined configuration
 * Uses settings from API_CONFIG for consistent API calls
 * Includes:
 * - Base URL for all requests
 * - Timeout settings
 * - Common headers
 */
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

/**
 * Fetches bills from the API or returns mock data
 * @param {boolean} isMock - Flag to toggle between mock and real data
 * @param {number} skip - Number of results to skip (for pagination)
 * @param {number} limit - Number of results per page
 * @returns {Promise<BillsResponse>} Promise resolving to bills data
 * @throws {Error} When API request fails
 */
export const fetchBills = async (
  isMock: boolean = false,
  limit: number = 10,
  skip: number = 0
): Promise<BillsResponse> => {
  if (isMock) return mockBills[0];
  try {
    const { data } = await axiosInstance.get<BillsResponse>(API_ENDPOINTS.LEGISLATION, {
      params: {
        ...API_CONFIG.bills.params,
        limit: limit.toString(),
        skip: skip.toString(),
      },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch bills:", error);
    throw error;
  }
};

export const debouncedFetchBills = debounce(async (skip: number) => {
  return await fetchBills(false, 25, skip);
}, 300);

export const favoriteService = {
  toggleFavorite: async (bill: Bill, isFavorite: boolean): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(
      `[Server] ${isFavorite ? "Adding" : "Removing"} bill ${bill.billNo} ${
        isFavorite ? "to" : "from"
      } favorites`
    );
  },
};

const cache = new Map();

export const fetchBillsWithCache = async (skip: number) => {
  const cacheKey = `bills-${skip}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await fetchBills(false, 25, skip);
  cache.set(cacheKey, response);
  return response;
};