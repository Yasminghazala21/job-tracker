import { useNavigate } from "react-router-dom";
import { Briefcase, LogOut, User } from "lucide-react";
import api from "../api/axios";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg">Job Tracker</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="font-medium hidden sm:block">{user.name}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
