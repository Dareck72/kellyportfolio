import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../api/projects.api";

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (data, variables) => {
      // Invalider et recharger les requêtes liées
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["project", variables.id]);
    },
  });
};

