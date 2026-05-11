// Central API helper
// All endpoints are prefixed with /api (Vite proxies to XAMPP)
const BASE_URL = "/api";
 
export async function apiPost(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method:      "POST",
    headers:     { "Content-Type": "application/json" },
    credentials: "include",   // sends PHP session cookie
    body:        JSON.stringify(body),
  });
  return response.json();
}
 
export async function apiGet(endpoint, params = {}) {
  const query  = new URLSearchParams(params).toString();
  const url    = query ? `${BASE_URL}${endpoint}?${query}` : `${BASE_URL}${endpoint}`;
  const response = await fetch(url, { credentials: "include" });
  return response.json();
}
 
export async function apiDelete(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method:      "DELETE",
    headers:     { "Content-Type": "application/json" },
    credentials: "include",
    body:        JSON.stringify(body),
  });
  return response.json();
}
