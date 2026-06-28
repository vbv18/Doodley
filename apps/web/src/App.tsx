import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import SignUp from "./pages/SignUp.js";
import SignIn from "./pages/SignIn.js";
import Dashboard from "./pages/Dashboard.js";
import Room from "./pages/Room.js";
import { useAuthStore } from "./store/auth.store.js";
import { refreshToken } from "./api/sessions.js";
import { getMe } from "./api/users.js";
import { useEffect } from "react";

export default function App() {
  const { setAccessToken, setUser, setInitialized, isInitialized } =
    useAuthStore();

  useEffect(() => {
    refreshToken()
      .then(async (data) => {
        setAccessToken(data.accessToken);
        const { user } = await getMe();
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          globalRole: user.globalRole,
          avatar_url: user.avatar_url,
        });
      })
      .catch(() => {
        //  no valid session
      })
      .finally(() => {
        setInitialized();
      });
  }, []);

  if (!isInitialized) {
    return (
      <div
        className="
          h-screen w-screen flex items-center justify-center bg-primary-bg
        "
      >
        <div
          className="
            animate-spin rounded-full h-8 w-8 border-2 border-primary-btn-bg border-t-transparent
          "
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms/:roomId" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute() {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
