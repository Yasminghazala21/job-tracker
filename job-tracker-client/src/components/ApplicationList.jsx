import { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Pencil,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  StickyNote,
  Loader2,
  Building2,
} from "lucide-react";
import api from "../api/axios";
import ApplicationForm from "./ApplicationForm";

const STATUS_CONFIG = {
  Applied: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  Interview: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  Offer: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
};

export default function ApplicationList({ applications, onRefresh }) {
  const [editingApp, setEditingApp] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("newest");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    setDeletingId(id);
    try {
      await api.delete(`/applications/${id}`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = applications
    .filter((app) => {
      const matchSearch = app.companyName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus = statusFilter ? app.status === statusFilter : true;
      return matchSearch && matchStatus;
    })
    .sort((a, b) =>
      sort === "oldest"
        ? new Date(a.appliedDate) - new Date(b.appliedDate)
        : new Date(b.appliedDate) - new Date(a.appliedDate),
    );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (editingApp) {
    return (
      <ApplicationForm
        editData={editingApp}
        onSuccess={() => {
          setEditingApp(null);
          onRefresh();
        }}
        onCancel={() => setEditingApp(null)}
      />
    );
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1" style={{ minWidth: "180px" }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Status</option>
              {["Applied", "Interview", "Rejected", "Offer"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <span className="ml-auto text-sm text-slate-500 font-medium">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Application Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 mx-auto mb-4">
            <Building2 className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No applications found</p>
          <p className="text-slate-400 text-sm mt-1">
            {search || statusFilter
              ? "Try adjusting your filters"
              : "Add your first application above"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG["Applied"];
            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-900 text-base">
                        {app.companyName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0 rounded-full text-xs font-medium border ${sc.bg} ${sc.text} ${sc.border}`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${sc.dot}`}
                        ></span>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">{app.role}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingApp(app)}
                      className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app._id)}
                      disabled={deletingId === app._id}
                      className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all disabled:opacity-50"
                    >
                      {deletingId === app._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      {deletingId === app._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {app.jobLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(app.appliedDate)}
                  </span>
                  {app.salaryRange && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {app.salaryRange}
                    </span>
                  )}
                  {app.jobLink && (
                    <a
                      href={app.jobLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Job Posting
                    </a>
                  )}
                </div>

                {app.notes && (
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-500">
                    <StickyNote className="w-3 h-3 mt-0 flex-shrink-0" />
                    <p>{app.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
