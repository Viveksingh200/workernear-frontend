"use client";

import { API_BASE_URL } from "@/config";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/authContext";
import { useLanguage } from "@/context/languageContext";
import { ShieldCheck, ShieldAlert, Users, FolderKanban, Plus, Trash2, Ban, UserCheck, RefreshCw, Star, Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  // Route security: Only admit authenticated Admin role
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Tab state: "approvals", "users", "categories"
  const [activeTab, setActiveTab] = useState("approvals");

  // Data states
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Category form states
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Security form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchAdminData = async () => {
    setLoadingData(true);
    setError("");
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      // 1. Fetch pending workers
      const resPending = await fetch(`${API_BASE_URL}/admin/pending-workers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataPending = await resPending.json();
      if (dataPending.success) setPendingWorkers(dataPending.workers);

      // 2. Fetch all workers
      const resWorkers = await fetch(`${API_BASE_URL}/admin/workers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataWorkers = await resWorkers.json();
      if (dataWorkers.success) setAllWorkers(dataWorkers.workers);

      // 3. Fetch all users
      const resUsers = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataUsers = await resUsers.json();
      if (dataUsers.success) setAllUsers(dataUsers.users);

      // 4. Fetch categories
      const resCats = await fetch(`${API_BASE_URL}/categories`);
      const dataCats = await resCats.json();
      if (dataCats.success) setCategories(dataCats.categories);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch administrative data.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 font-semibold animate-pulse">Loading Admin Panel...</p>
      </div>
    );
  }

  // Handle worker approval
  const handleApproveWorker = async (workerId) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/approve/${workerId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Worker profile approved successfully!");
        fetchAdminData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to approve worker.");
      }
    } catch (err) {
      console.error(err);
      setError("Error during worker approval.");
    }
  };

  // Handle user block/unblock toggle
  const handleToggleBlock = async (userId) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/block/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || "User status updated successfully!");
        fetchAdminData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to toggle block status.");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating block status.");
    }
  };

  // Handle delete fake profile
  const handleDeleteFakeWorker = async (workerId) => {
    if (!confirm("Are you sure you want to permanently delete this worker profile and login account?")) return;
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/workers/fake/${workerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Fake profile deleted successfully.");
        fetchAdminData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to delete profile.");
      }
    } catch (err) {
      console.error(err);
      setError("Error deleting fake profile.");
    }
  };

  // Handle add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newCatName) return;

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/categories/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatName, icon: newCatIcon })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Category added successfully!");
        setNewCatName("");
        setNewCatIcon("");
        fetchAdminData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to add category.");
      }
    } catch (err) {
      console.error(err);
      setError("Error adding category.");
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (catId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${catId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Category deleted successfully.");
        fetchAdminData();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to delete category.");
      }
    } catch (err) {
      console.error(err);
      setError("Error deleting category.");
    }
  };

  const handleAdminPasswordChange = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setUpdatingPassword(true);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      setUpdatingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setUpdatingPassword(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full animate-fadeIn">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Admin Control Panel</h1>
            <p className="text-xs text-zinc-400 font-semibold uppercase mt-0.5 tracking-wider">
              Local Service Finder India Management
            </p>
          </div>
          <button
            onClick={fetchAdminData}
            className="flex items-center gap-1 text-xs font-bold bg-white border border-zinc-200 px-3.5 py-2 rounded-xl text-zinc-700 hover:bg-zinc-50 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload Logs</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-4 rounded-xl border border-red-100 mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-xs font-semibold p-4 rounded-xl border border-green-100 mb-6">
            {success}
          </div>
        )}

        {/* Dashboard Tabs navigation */}
        <div className="grid grid-cols-2 md:flex border border-gray-150 mb-8 bg-white rounded-xl p-1 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
              activeTab === "approvals"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Pending Approvals ({pendingWorkers.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
              activeTab === "users"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Directory ({allUsers.length + allWorkers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
              activeTab === "categories"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <FolderKanban className="h-4 w-4" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
              activeTab === "security"
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security Settings</span>
          </button>
        </div>

        {/* Tab contents */}
        {loadingData ? (
          <div className="animate-pulse bg-white border border-gray-150 h-96 rounded-2xl"></div>
        ) : (
          <div>
            {/* TAB: Approvals */}
            {activeTab === "approvals" && (
              <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="font-extrabold text-lg text-zinc-950">Pending Professional Profiles</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Approve new worker profiles before they go live in search discovery.</p>
                </div>

                {pendingWorkers.length === 0 ? (
                  <div className="text-center py-16 text-zinc-400 text-sm">
                    No pending profiles awaiting approval.
                  </div>
                ) : (
                  <div>
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-extrabold border-b border-gray-100 text-[10px]">
                            <th className="px-6 py-4">Worker details</th>
                            <th className="px-6 py-4">Profession</th>
                            <th className="px-6 py-4">Experience</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-zinc-700">
                          {pendingWorkers.map((w) => (
                            <tr key={w._id} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-bold text-zinc-900">{w.name}</div>
                                <div className="text-[10px] text-zinc-400 mt-0.5">{w.phone}</div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-orange-600 uppercase">{w.profession}</td>
                              <td className="px-6 py-4">{w.experience} Years</td>
                              <td className="px-6 py-4">{w.area}, {w.city}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleApproveWorker(w._id)}
                                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer shadow-sm"
                                  >
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    <span>Approve Live</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFakeWorker(w._id)}
                                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Reject / Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View Cards */}
                    <div className="block md:hidden divide-y divide-gray-150">
                      {pendingWorkers.map((w) => (
                        <div key={w._id} className="p-4 flex flex-col gap-3 hover:bg-zinc-50/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="text-left">
                              <div className="font-bold text-zinc-900 text-sm">{w.name}</div>
                              <div className="text-[10px] text-zinc-400 mt-0.5">{w.phone}</div>
                            </div>
                            <span className="text-[9px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded font-extrabold uppercase shrink-0">
                              {w.profession}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-left text-xs text-zinc-650 bg-zinc-50 p-2.5 rounded-xl border border-zinc-150">
                            <div>
                              <span className="font-bold text-zinc-400 block text-[9px] uppercase">Experience</span>
                              <span className="font-semibold text-zinc-700">{w.experience} Years</span>
                            </div>
                            <div>
                              <span className="font-bold text-zinc-400 block text-[9px] uppercase">Location</span>
                              <span className="font-semibold text-zinc-700 truncate block">{w.area}, {w.city}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full mt-1">
                            <button
                              onClick={() => handleApproveWorker(w._id)}
                              className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 rounded-lg text-xs cursor-pointer shadow-sm"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleDeleteFakeWorker(w._id)}
                              className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold py-2 rounded-lg text-xs cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Directory */}
            {activeTab === "users" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Workers Directory */}
                <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-zinc-50/50">
                    <h3 className="font-extrabold text-zinc-900 text-base">Workers Index ({allWorkers.length})</h3>
                  </div>
                  
                  <div className="divide-y divide-gray-100 max-h-160 overflow-y-auto">
                    {allWorkers.map((w) => (
                      <div key={w._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/50 text-xs text-left">
                        <div>
                          <div className="font-bold text-zinc-900 flex items-center gap-2">
                            <span>{w.name}</span>
                            <span className="text-[9px] bg-orange-50 text-orange-600 border border-orange-100 px-1.5 py-0.2 rounded font-extrabold">{w.profession}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{w.phone} | {w.area}, {w.city}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-zinc-500 font-medium">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{w.rating} ({w.totalReviews} reviews)</span>
                            <span className="text-zinc-300">|</span>
                            <span>Score: {w.rankingScore}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleToggleBlock(w.userId)}
                            className={`px-2.5 py-1.5 rounded-lg border font-bold text-[9px] cursor-pointer ${
                              allUsers.find((u) => u._id === w.userId)?.isBlocked
                                ? "bg-red-50 border-red-200 text-red-600"
                                : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                            }`}
                          >
                            {allUsers.find((u) => u._id === w.userId)?.isBlocked ? "Blocked" : "Block"}
                          </button>
                          <button
                            onClick={() => handleDeleteFakeWorker(w._id)}
                            className="bg-red-50 border border-red-100 text-red-600 px-2.5 py-1.5 rounded-lg text-[9px] font-bold hover:bg-red-100 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Users Directory */}
                <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-zinc-50/50">
                    <h3 className="font-extrabold text-zinc-900 text-base">Users Index ({allUsers.length})</h3>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-160 overflow-y-auto">
                    {allUsers.map((u) => (
                      <div key={u._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/50 text-xs text-left">
                        <div>
                          <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <span className="text-[8px] bg-zinc-100 text-zinc-500 border px-1 rounded uppercase font-bold">{u.role}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{u.phone}</p>
                          <p className="text-[9px] text-zinc-400 mt-1">Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleToggleBlock(u._id)}
                            className={`px-3 py-1.5 rounded-lg border font-bold text-[9px] cursor-pointer ${
                              u.isBlocked
                                ? "bg-red-50 border-red-200 text-red-600"
                                : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                            }`}
                          >
                            {u.isBlocked ? "Blocked" : "Block"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Categories */}
            {activeTab === "categories" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Category Form */}
                <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm h-fit">
                  <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-1.5">
                    <Plus className="h-4.5 w-4.5 text-orange-500" />
                    <span>Add New Category</span>
                  </h3>

                  <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-zinc-500">Category Name</label>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. RO Service"
                        className="px-3.5 py-2 border border-zinc-250 rounded-lg text-xs"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-zinc-500">Lucide Icon Key (Optional)</label>
                      <input
                        type="text"
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        placeholder="e.g. Snowflake"
                        className="px-3.5 py-2 border border-zinc-250 rounded-lg text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm cursor-pointer"
                    >
                      Save Category
                    </button>
                  </form>
                </div>

                {/* Categories Table list */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-extrabold text-zinc-900 text-base">Service Categories</h3>
                  </div>

                  {categories.length === 0 ? (
                    <p className="text-zinc-400 text-center py-10 text-xs">No categories added yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {categories.map((c) => (
                        <div key={c._id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 text-xs font-bold">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-800">{c.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">({c.slug})</span>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteCategory(c._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* TAB: Security / Password Reset */}
            {activeTab === "security" && (
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-zinc-800 shrink-0" />
                  <span>Update Admin Password</span>
                </h2>

                <form onSubmit={handleAdminPasswordChange} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 pr-10 border border-zinc-250 rounded-lg text-sm bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 pr-10 border border-zinc-250 rounded-lg text-sm bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 pr-10 border border-zinc-250 rounded-lg text-sm bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 text-white py-2.5 font-extrabold text-sm hover:bg-zinc-800 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>{updatingPassword ? "Updating Password..." : "Change Password"}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
