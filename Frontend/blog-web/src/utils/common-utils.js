
export const getAccessToken = () => {
  return localStorage.getItem("accessToken") || "";
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken") || "";
};

export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getType = () => {
  return localStorage.getItem("type") || "";
};
