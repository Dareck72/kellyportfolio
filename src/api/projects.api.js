// api/user.api.js

import { api } from "./axios";
import { refreshToken } from "./refresh";

export const fetchProjects = async () => {
  try {
    const { data } = await api.get("/projects");
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      await refreshToken();
      const { data } = await api.get("/projects");
      return data;
    }
    throw err;
  }
};

export const fetchsiteInfos = async () => {
  try {
    const { data } = await api.get("/site");
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      await refreshToken();
      const { data } = await api.get("/site");
      return data;
    }
    throw err;
  }
};

export const createproject = async (datatosend) => {
  try {
    const { data } = await api.post("/project/", datatosend);
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      await refreshToken();
      const { data } = await api.post("/project/", datatosend);
      return data;
    }
    throw err;
  }
};
export const updateProject = async (id, datatosend) => {
  try {
    const { data } = await api.put(`/projects/update/${id}`, datatosend);
    return data;
  } catch (err) {
    // Si token expiré (401), on tente de rafraîchir
    if (err.response?.status === 401) {
      try {
        await refreshToken();
        // Deuxième tentative avec le nouveau token
        const { data } = await api.put(`/projects/update/${id}`, datatosend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return data;
      } catch (refreshError) {
        // Si le refresh échoue, rediriger vers login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/connexion";
        throw refreshError;
      }
    }
    throw err;
  }
};

export const fetchOneProjects = async (id) => {
  console.log("📡 Fetching project:", id);

  try {
    const { data } = await api.get(`/projects/detail/${id}`);
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      try {
        await refreshToken();
        const { data } = await api.get(`/projects/detail/${id}`);
        return data;
      } catch (e) {
        // ✅ IMPORTANT: Lancez une erreur, ne retournez pas undefined
        throw new Error("Session expirée, veuillez vous reconnecter");
      }
    }
    throw err; // ✅ Lancez l'erreur, ne laissez pas undefined
  }
};
