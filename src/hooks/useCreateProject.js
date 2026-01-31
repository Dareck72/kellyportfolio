import { useMutation } from "@tanstack/react-query";
import { createproject } from "../api/projects.api";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createproject,
    
})
}
;
