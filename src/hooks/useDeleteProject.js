import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axios";
import { refreshToken } from "../api/refresh";

const deleteProject = async (id) => {
  try {
    const { data } = await api.delete(`/projects/delete/${id}`, {});
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      await refreshToken();
      const { data } = await api.delete(`/projects/delete/${id}`, {});
      return data;
    }
    throw err;
  }
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: deleteProject,
  });
};
