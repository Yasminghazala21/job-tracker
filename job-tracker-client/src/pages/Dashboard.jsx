import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  MessageSquare,
  XCircle,
  Trophy,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationList from "../components/ApplicationList";

const STAT_CONFIG = [
  {
    key: "total",
    label: "Total",
    icon: LayoutDashboard,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    valueColor: "text-blue-700",
  },
  {
    key: "applied",
    label: "Applied",
    icon: Send,
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    valueColor: "text-indigo-700",
  },
  {
    key: "interview",
    label: "Interview",
    icon: MessageSquare,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-amber-700",
  },
  {
    key: "offer",
    label: "Offer",
    icon: Trophy,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-700",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    bg: "bg-red-50",
    iconColor: "text-red-600",
    valueColor: "text-red-700",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);
        await fetchApplications();
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "Applied").length,
    interview: applications.filter((a) => a.status === "Interview").length,
    offer: applications.filter((a) => a.status === "Offer").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage all your job applications in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {STAT_CONFIG.map(
            ({ key, label, icon: Icon, bg, iconColor, valueColor }) => (
              <div
                key={key}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3"
              >
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-xl ${bg}`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${valueColor}`}>
                    {stats[key]}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0">
                    {label}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>

        <ApplicationForm onSuccess={fetchApplications} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">
            Your Applications
          </h2>
          <span className="text-sm text-slate-500">
            {applications.length} total
          </span>
        </div>

        <ApplicationList
          applications={applications}
          onRefresh={fetchApplications}
        />
      </main>
    </div>
  );
}
