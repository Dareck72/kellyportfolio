// hooks/useUsers.js
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchsiteInfos } from "../api/projects.api";

export const useProjects = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchProjects,
  });
};

export const useSite = () => {
  return useQuery({
    queryKey: ["site"],
    queryFn: fetchsiteInfos,
  });
};


