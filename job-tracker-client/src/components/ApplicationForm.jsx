import { useState } from "react";
import {
  Building2, Briefcase, MapPin, DollarSign,
  Link as LinkIcon, StickyNote, Calendar, Loader2, Plus, Pencil
} from "lucide-react";
import api from "../api/axios";

const STATUS_OPTIONS = ["Applied", "Interview", "Rejected", "Offer"];

const INITIAL_FORM = {
  companyName: "", role: "", jobLocation: "",
  salaryRange: "", jobLink: "", status: "Applied",
  notes: "", appliedDate: new Date().toISOString().split("T")[0],
};

const inputClass = "w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400";

export default function ApplicationForm({ onSuccess, editData = null, onCancel }) {
  const isEditing = !!editData;
  const [formData, setFormData] = useState(
    editData ? { ...editData, appliedDate: editData.appliedDate?.split("T")[0] } : INITIAL_FORM
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/applications/${editData._id}`, formData);
      } else {
        await api.post("/applications", formData);
        setFormData(INITIAL_FORM);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

      <div className="flex items-center gap-2 mb-5">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isEditing ? "bg-amber-100" : "bg-blue-100"}`}>
          {isEditing
            ? <Pencil className="w-4 h-4 text-amber-600" />
            : <Plus className="w-4 h-4 text-blue-600" />
          }
        </div>
        <h2 className="text-base font-semibold text-slate-900">
          {isEditing ? "Edit Application" : "Add New Application"}
        </h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" name="companyName" value={formData.companyName}
                onChange={handleChange} placeholder="Google, Meta, Amazon..." required className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" name="role" value={formData.role}
                onChange={handleChange} placeholder="Software Engineer" required className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" name="jobLocation" value={formData.jobLocation}
                onChange={handleChange} placeholder="Remote / New York, NY" required className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Applied Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="date" name="appliedDate" value={formData.appliedDate}
                onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Salary Range <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" name="salaryRange" value={formData.salaryRange}
                onChange={handleChange} placeholder="$80k – $120k" className={inputClass} />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Link <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" name="jobLink" value={formData.jobLink}
                onChange={handleChange} placeholder="https://careers.company.com/..." className={inputClass} />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1">
              <StickyNote className="w-4 h-4 text-slate-400" />
              Notes <span className="text-slate-400 font-normal">(optional)</span>
            </span>
          </label>
          <textarea name="notes" value={formData.notes} onChange={handleChange}
            placeholder="Interview prep notes, contact info, next steps..." rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Application"}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel}
              className="py-2 px-5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
