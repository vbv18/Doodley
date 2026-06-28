import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth.js";
import { useAuthStore } from "../store/auth.store.js";

export function useRegisterUser() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => register(name, email, password),

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
