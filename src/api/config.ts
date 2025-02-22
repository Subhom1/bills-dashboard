/**
 * API Configuration Object
 * Contains all the necessary settings for making API requests
 * Centralizes configuration to maintain consistency across the application
 */
export const API_CONFIG = {
  // Base URL from environment variables for different deployment environments
  baseURL: process.env.VITE_API_URL,

  // Request timeout in milliseconds to prevent hanging requests
  timeout: 10000,

  // Standard headers for API requests
  headers: {
    'Content-Type': 'application/json',
  },

  // Bills endpoint specific configuration
  bills: {
    // Query parameters for bills endpoint
    params: {
      // Filter bills by their current status
      bill_status: "Current,Withdrawn,Enacted,Rejected,Defeated,Lapsed",

      // Filter by bill source (Government or Private Member bills)
      bill_source: "Government,Private Member",

      // Date range for bill search
      date_start: "1900-01-01",  // Historical bills from 1900
      date_end: "2099-01-01",    // Future bills up to 2099

      // Pagination settings
      limit: "5",    // Number of results per page
      skip: "0",     // Number of results to skip (for pagination)

      // Optional chamber filter
      chamber_id: "", // Empty for all chambers
    }
  }
};