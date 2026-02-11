import {
  Users,
  TrendingUp,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: TrendingUp, label: "Prediction", path: "/prediction" },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen sidebar-gradient flex flex-col transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-md hover:bg-primary/90 transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div
        className={`p-6 flex items-center gap-3 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-12 h-12 bg-sidebar-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Activity className="w-7 h-7 text-white" />
        </div>

        {!isCollapsed && (
          <div>
            <h1 className="font-semibold text-white text-lg">
              Preventive Medicine
            </h1>
            <p className="text-white/80 text-sm">
              Thermal Comfort Monitoring
            </p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6">
        {!isCollapsed && (
          <p className="text-white/70 text-xs uppercase tracking-wider mb-4 px-3">
            Menu
          </p>
        )}

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-sidebar-primary/20 text-white"
                      : "text-white/80 hover:bg-sidebar-primary/10 hover:text-white"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors w-full ${
              isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Log out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
