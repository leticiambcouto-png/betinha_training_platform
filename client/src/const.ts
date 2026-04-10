export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// The state encodes both the origin and the return path so the callback can
// redirect the user back to the page they were trying to access.
export const getLoginUrl = (returnPath = "/dashboard") => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const origin = window.location.origin;
  const redirectUri = `${origin}/api/oauth/callback`;

  // Encode both origin and returnPath in state so the server can redirect correctly
  const state = btoa(JSON.stringify({ redirectUri, returnPath, origin }));

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
