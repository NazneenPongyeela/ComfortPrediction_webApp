import Sidebar from "./Sidebar";
import { Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOutUser } from "@/lib/firebase";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutUser();
    localStorage.removeItem("idToken");
    sessionStorage.removeItem("idToken");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center gap-2 mb-6">
          <Smartphone className="w-6 h-6 text-muted-foreground" />
        </div>

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
