import { api } from "./client";

function toErrorMessage(err) {
  const data = err?.response?.data;
  return data?.message || err?.message || "Error de red";
}

export async function fetchAccommodationReviews(accommodationId) {
  try {
    const res = await api.get(`/accommodations/${accommodationId}/reviews`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function createAccommodationReview(accommodationId, payload) {
  try {
    const res = await api.post(
      `/accommodations/${accommodationId}/reviews`,
      payload,
    );
    return res.data;
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}
