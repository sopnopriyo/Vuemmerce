export const API_BASE_URL = "";

export const OAUTH2_REDIRECT_URI = process.env.baseUrl + "/oauth2/redirect";

export const GOOGLE_AUTH_URL =
  API_BASE_URL +
  "/api/oauth2/authorize/google?redirect_uri=" +
  OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL =
  API_BASE_URL +
  "/api/oauth2/authorize/facebook?redirect_uri=" +
  OAUTH2_REDIRECT_URI;
