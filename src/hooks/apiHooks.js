// src/api/api.js
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../constants';

export function useApi() {
  const navigate = useNavigate();

  const apiFetch = async (url, method = 'GET', data = null) => { // Add method and data parameters
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', // Keep this for consistency
      // Add other common headers here if needed
    };

    const options = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data); // Stringify data for POST/PUT/PATCH
    }
    
    // debugger
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (response.status === 401) {
      navigate('/login');
      return null; // Or throw an error
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API Error: ${response.status}`);
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
        return null; // Or return an empty object/array, as appropriate
    }


    return response.json();
  };

  return apiFetch;
}

// Helper functions (optional, but recommended for cleaner code):
export async function get(apiFetch, url) {
    return apiFetch(url, 'GET');
}
export async function post(apiFetch, url, data) {
    return apiFetch(url, 'POST', data);
}

export async function put(apiFetch, url, data) {
  return apiFetch(url, 'PUT', data);
}
export async function patch(apiFetch, url, data) {
    return apiFetch(url, 'PATCH', data);
  }

export async function del(apiFetch, url) { // Use 'del' instead of 'delete'
  return apiFetch(url, 'DELETE');
}

// Example Usage (inside a component):
// const apiFetch = useApi();
// const data = await post(apiFetch, '/api/users', { name: 'John Doe' });