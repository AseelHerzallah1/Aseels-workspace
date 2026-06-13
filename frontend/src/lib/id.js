// crypto.randomUUID() only works on HTTPS or localhost. When testing on a phone
// over http://<laptop-ip>:3000 it can be undefined, so we fall back to a simple
// random id that is good enough for local conversation keys.
export function uuid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
