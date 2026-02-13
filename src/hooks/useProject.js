// hooks/useProject.js
import { useQuery } from "@tanstack/react-query";
import { fetchOneProjects } from "../api/projects.api";

export const useProject = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: ()=>fetchOneProjects(id), // Ne s'exécute que si id existe
  });
};