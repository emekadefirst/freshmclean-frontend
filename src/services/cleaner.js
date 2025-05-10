import { apiCall } from "./api";


export async function submitKYC(data) {
  const token = localStorage.getItem('access_token');
  const response = await apiCall('kyc', data, 'POST', token);
  return response;
}