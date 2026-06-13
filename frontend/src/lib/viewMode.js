const KEY = "aseel-app-view";
const LOGIN_REDIRECT_KEY = "aseel-login-redirect";

/** @typedef {"public" | "workspace"} AppView */

/** @returns {AppView} */
export function readAppView() {
  if (typeof window === "undefined") return "workspace";
  return sessionStorage.getItem(KEY) === "public" ? "public" : "workspace";
}

/** @param {AppView} view */
export function saveAppView(view) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, view);
}

/** Call before OAuth — after sign-in, land in private workspace first. */
export function markLoginRedirectWorkspace() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LOGIN_REDIRECT_KEY, "1");
}

/** @returns {boolean} */
export function consumeLoginRedirect() {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(LOGIN_REDIRECT_KEY) !== "1") return false;
  sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
  return true;
}
