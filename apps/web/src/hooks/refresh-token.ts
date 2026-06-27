import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth.store.js";
import { refreshToken } from "../api/sessions.js";

export function useRefreshToken() {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setUser = useAuthStore((s) => s.setUser);
    const attempted = useRef(false);

    useEffect(() => {
        if (attempted.current) return;
        attempted.current = true;

        refreshToken()
            .then((data) => {
                setAccessToken(data.accessToken);
            })
            .catch(() => {
                // No valid refresh cookie — user needs to log in
            });
    }, [setAccessToken, setUser]);
}