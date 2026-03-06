import client from "./client";

export function registerRequest(data) {
  return client.post("/auth/register", data);
}

export function loginRequest(data) {
  return client.post("/auth/login", data);
}

export function meRequest() {
  return client.get("/auth/me");
}
