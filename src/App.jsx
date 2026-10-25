import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import Compare from "./pages/Compare";
import About from "./pages/About";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/octocat" replace />} />
          <Route path="/dashboard/:username" element={<Dashboard />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
