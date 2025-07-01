// client/src/services/api.js

// Environment-aware API base URL
const API_BASE_URL = ""; // Use proxy for all environments

export const getToken = () => localStorage.getItem("token");

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const token = getToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, finalOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const postWithToken = async (url, data) => {
  return apiCall(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
