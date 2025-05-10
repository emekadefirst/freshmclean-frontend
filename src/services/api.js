export const API = "https://artificial-cherianne-emekadefirst-4fe958c5.koyeb.app";
// export const API = import.meta.env.VITE_API_URL;

const access_token = localStorage.getItem("access_token");

export async function apiCall(path, data = null, method = 'GET', token = null) {
  const isFormData = data instanceof FormData;
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers,
    body: data ? (isFormData ? data : JSON.stringify(data)) : null,
  };

  try {
    console.log('Making API call to:', `${API}/${path}`);
    console.log('With options:', options);
    
    const response = await fetch(`${API}/${path}`, options);
    const result = await response.json();

    console.log('API Response:', result);

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return {
      status: response.status,
      ok: response.ok,
      ...result,
    };
  } catch (err) {
    console.error('Fetch failed:', err);
    throw err;
  }
}