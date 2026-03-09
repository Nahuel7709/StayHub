import { api } from "./client";

function toErrorMessage(err) {
  const data = err?.response?.data;
  return data?.message || err?.message || "Error de red";
}

export async function fetchFeatures() {
  try {
    const res = await api.get("/features");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function createFeature(payload) {
  try {
    const res = await api.post("/features", payload);
    return res.data;
  } catch (err) {
    const data = err?.response?.data;
    const message =
      data?.message || err?.message || "Error al crear característica";
    const fields = data?.fields || null;
    const e = new Error(message);
    e.fields = fields;
    throw e;
  }
}

export async function deleteFeature(id) {
  try {
    await api.delete(`/features/${id}`);
    return true;
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function updateFeature(id, payload) {
  try {
    const res = await api.put(`/features/${id}`, payload);
    return res.data;
  } catch (err) {
    const data = err?.response?.data;
    const message =
      data?.message || err?.message || "Error al actualizar característica";
    const fields = data?.fields || null;
    const e = new Error(message);
    e.fields = fields;
    throw e;
  }
}