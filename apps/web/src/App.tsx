import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import SignUp from "./pages/SignUp.js";
import SignIn from "./pages/SignIn.js";
import Dashboard from "./pages/Dashboard.js";
import { useAuthStore } from "./store/auth.store.js";


export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function ProtectedRoute() {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}