import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SiteFooter from "./SiteFooter";

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-github-bg">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
