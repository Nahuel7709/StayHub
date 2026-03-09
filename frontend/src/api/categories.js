import { api } from "./client";

function toErrorMessage(err) {
  const data = err?.response?.data;
  return data?.message || err?.message || "Error de red";
}

export async function fetchCategories() {
  try {
    const res = await api.get("/categories");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function createCategory(payload) {
  try {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("description", payload.description);
    if (payload.file) {
      fd.append("image", payload.file);
    }

    const res = await api.post("/categories", fd);
    return res.data;
  } catch (err) {
    const data = err?.response?.data;
    const message = data?.message || err?.message || "Error al crear categoría";
    const fields = data?.fields || null;
    const e = new Error(message);
    e.fields = fields;
    throw e;
  }
}

export async function deleteCategory(id) {
  try {
    await api.delete(`/categories/${id}`);
    return true;
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}
