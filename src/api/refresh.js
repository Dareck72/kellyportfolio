// api/refresh.js
import axios from "axios";

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
    if (refresh) {
    const { data } = await axios.post(
    "https://dkhportfolio.pythonanywhere.com/api/auth/token/refresh/",
    { refresh }
  );
  localStorage.setItem("access", data.access);
}
};
