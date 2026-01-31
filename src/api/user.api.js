import axios from "axios";

export const login = async (credentials) => {
  const { data } = await axios.post(
    "https://dkhportfolio.pythonanywhere.com/api/auth/login/",
    {
      username: credentials.email,
      password : credentials.password
    }
  );
  return data;
};


