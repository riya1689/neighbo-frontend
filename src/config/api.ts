/**
 * Centralized API configuration
 * This handles the fallback to localhost if the environment variable is missing.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// If your NEXT_PUBLIC_API_URL in .env does NOT include "/api", use this instead:
// export const API_URL = `${API_BASE_URL}/api`;

export const API_URL = API_BASE_URL; // Since we put /api in the .env above
