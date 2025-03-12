import { useAuthToken } from "./useAuthToken";

export const useFetch = () => {
  const { token } = useAuthToken(); // Use token from custom hook

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return { fetchWithAuth };
};
