import axios from 'axios';
import { mockBills } from '@/tests/mocks/mockBills';
import { Bill } from '@/types';
import { API_CONFIG } from './config';

/**
 * Interface representing the structure of the bills API response
 * Contains metadata in the head object and an array of bill results
 * @interface BillsResponse
 */
interface BillsResponse {
  head: {
    counts: {
      billCount: number;  // Total number of bills in the database
      resultCount: number;  // Number of bills in current response
    };
    dateRange: {
      start: string;  // Start date of the query range
      end: string;    // End date of the query range
    };
    lang: string;  // Response language code
  };
  results: {
    bill: Bill;  // Array of bill objects
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
  headers: API_CONFIG.headers
});

/**
 * Fetches bills from the API or returns mock data
 * @param {boolean} isMock - Flag to toggle between mock and real data
 * @returns {Promise<BillsResponse>} Promise resolving to bills data
 * @throws {Error} When API request fails
 */
export const fetchBills = async (isMock: boolean = false): Promise<BillsResponse> => {
  // Return mock data if isMock is true
  if (isMock) return mockBills[0];

  try {
    // Make API request with configured parameters
    const { data } = await axiosInstance.get<BillsResponse>("/legislation", {
      params: API_CONFIG.bills.params,
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch bills:', error);
    throw error;
  }
};