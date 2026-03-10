import { api } from "./client";

function toErrorMessage(err) {
  const data = err?.response?.data;
  return data?.message || err?.message || "Error de red";
}

export async function fetchRandomAccommodations(limit = 10) {
  try {
    const res = await api.get("/accommodations/random", { params: { limit } });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function fetchAccommodationsPage({
  page = 0,
  size = 10,
  categoryId,
  query,
  startDate,
  endDate,
} = {}) {
  try {
    const params = { page, size };

    if (categoryId) params.categoryId = categoryId;
    if (query?.trim()) params.query = query.trim();
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await api.get("/accommodations", { params });
    return res.data;
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function fetchAccommodationById(id) {
  try {
    const res = await api.get(`/accommodations/${id}`);
    return res.data;
  } catch (err) {
    const data = err?.response?.data;
    throw new Error(data?.message || err?.message || "Error cargando detalle");
  }
}

export async function fetchAccommodationAvailability(
  id,
  { startDate, endDate } = {},
) {
  try {
    const params = {};

    if ((startDate && !endDate) || (!startDate && endDate)) {
      throw new Error("Debés ingresar check-in y check-out juntos");
    }

    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const res = await api.get(`/accommodations/${id}/availability`, { params });
    return res.data;
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function deleteAccommodation(id) {
  try {
    await api.delete(`/accommodations/${id}`);
    return true;
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function fetchAdminAccommodations() {
  try {
    const res = await api.get("/accommodations/admin");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function fetchAdminAccommodationCards() {
  try {
    const res = await api.get("/accommodations/admin/cards");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    const data = err?.response?.data;
    throw new Error(data?.message || err?.message || "Error cargando admin");
  }
}

export async function createAccommodation(payload) {
  try {
    const res = await api.post("/accommodations", payload);
    return res.data;
  } catch (err) {
    const data = err?.response?.data;
    const message = data?.message || err?.message || "Error al crear";
    const fields = data?.fields || null;
    const e = new Error(message);
    e.fields = fields;
    throw e;
  }
}

export async function createAccommodationMultipart(payload) {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("description", payload.description);
  fd.append("type", payload.type);
  fd.append("city", payload.city);
  fd.append("country", payload.country);

  if (payload.pricePerNight != null) {
    fd.append("pricePerNight", String(payload.pricePerNight));
  }

  if (payload.categoryId) {
    fd.append("categoryId", payload.categoryId);
  }

  for (const featureId of payload.featureIds || []) {
    fd.append("featureIds", featureId);
  }

  for (const f of payload.files || []) {
    fd.append("images", f);
  }

  const res = await api.post("/accommodations", fd);
  return res.data;
}
