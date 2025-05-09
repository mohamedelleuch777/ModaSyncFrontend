import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../constants';

export function useApi() {
  const navigate = useNavigate();

  const apiFetch = async (url, method = 'GET', data = null, header = null) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    let options = {
      method,
      headers,
    };

    if (header) {
      options = header;
      options.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    try { //  Add try-catch *inside* apiFetch
      const response = await fetch(`${API_BASE_URL}${url}`, options);

      if (response.status === 401) {
        navigate('/login');
        return null; //  Or throw new Error('Unauthorized');
      }

      return response.json();

    } catch (error) {
      console.error('Error in apiFetch:', error);
      throw error;
    }
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

export async function put(apiFetch, url, data, header) {
  return apiFetch(url, 'PUT', data, header);
}
export async function patch(apiFetch, url, data) {
    return apiFetch(url, 'PATCH', data);
  }

export async function del(apiFetch, url) { // Use 'del' instead of 'delete'
  return apiFetch(url, 'DELETE');
}

