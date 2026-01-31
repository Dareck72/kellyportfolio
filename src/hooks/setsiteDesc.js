import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axios";
import { refreshToken } from "../api/refresh";

const updateDesc = async (description) => {
  try {
    const { data } = await api.put("/site/update/1", {
      description,
    });
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      await refreshToken();
      const { data } = await api.put("/site/update/1", {
        description,
      });
      return data;
    }
    throw err;
  }
};

export const useSetSiteDesc = () => {
  return useMutation({
    mutationFn: updateDesc,
  });
};
