import { useState, useEffect } from "react";

export const useAuthToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (newToken) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
  };

  return { token, saveToken, clearToken };
};
