import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";
import { useAuthStore } from "../store/auth.store.js";

export function useLoginUser() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),

    onSuccess: (data) => {
      const { setAccessToken, setUser } = useAuthStore.getState();

      setAccessToken(data.accessToken);
      setUser(data.user);

      navigate("/dashboard");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
