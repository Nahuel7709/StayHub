import { api } from "./client";

function toErrorMessage(err) {
  const data = err?.response?.data;
  return data?.message || err?.message || "Error de red";
}

export async function fetchMyFavorites() {
  try {
    const res = await api.get("/favorites/me");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function fetchMyFavoriteIds() {
  try {
    const res = await api.get("/favorites/me/ids");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function addFavorite(accommodationId) {
  try {
    const res = await api.post(`/favorites/${accommodationId}`);
    return res.data;
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function removeFavorite(accommodationId) {
  try {
    await api.delete(`/favorites/${accommodationId}`);
    return true;
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}
