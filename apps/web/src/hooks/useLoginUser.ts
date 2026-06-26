import { useMutation } from "@tanstack/react-query";

import { login } from "../api/auth.js";
import { useAuthStore } from "../store/auth.store.js";

export function useLoginUser() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),

    onSuccess: (data) => {
      const { setAccessToken, setUser } = useAuthStore.getState();

      setAccessToken(data.accessToken);
      setUser(data.user);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
