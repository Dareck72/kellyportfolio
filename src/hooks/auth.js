import { useMutation } from "@tanstack/react-query";
import { login } from "../api/user.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const { access, refresh } = data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      
    }
})
}
;
