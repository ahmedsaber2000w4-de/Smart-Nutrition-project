import axios from "axios";
 
const AUTH_API = "https://trying-task.vercel.app/";
const GP_API   = "https://gp-backend-production-7b9a.up.railway.app/api";
 
// ── Login ────────────────────────────────────────────────────
export const loginApi = async (formData) => {
  const response = await axios.post(`${AUTH_API}login`, {
    email:    formData.email,
    password: formData.password,
  });
 
  const data = response.data;
 
  if (data?.token) {
    localStorage.setItem("token",      data.token);
    localStorage.setItem("fullname",   data.data?.user?.fullname  ?? "");
    localStorage.setItem("userEmail",  data.data?.user?.email     ?? formData.email);
    localStorage.setItem("hasProfile", data.data?.hasProfile ? "true" : "false");
  }
 
  return data;
};
 
// ── Register ─────────────────────────────────────────────────
export const registerApi = async (formData) => {
  const response = await axios.post(`${AUTH_API}register`, formData);
  return response.data;
};
 
export const generatePlanApi = async (durationDays = 3) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
 
  const response = await axios.post(
    `${GP_API}/plan/${durationDays}`,
    {},
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );
  return response.data;
};