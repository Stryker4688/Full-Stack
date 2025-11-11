// app/admin/users/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  ShieldOff,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import api from "../../../utils/axios";
import { useAuth } from "../../../contexts/AuthContext"; // اضافه شد

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AdminsResponse {
  admins: Admin[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export default function AdminUsersPage() {
  const {
    user,
    isAuthenticated,
    isSuperAdmin,
    loading: authLoading,
  } = useAuth(); // اضافه شد
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // فرم ایجاد ادمین جدید
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loadingActions, setLoadingActions] = useState<string[]>([]);

  // 🔒 چک دسترسی - اضافه شد
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isSuperAdmin())) {
      window.location.href = "/forbidden";
      return;
    }
  }, [isAuthenticated, isSuperAdmin, authLoading]);

  // نمایش پیام‌ها
  const showMessage = (message: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
  };

  // دریافت لیست ادمین‌ها
  const fetchAdmins = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<AdminsResponse>("/admin/admins", {
        params: {
          page: pageNum,
          limit: 10,
        },
      });

      setAdmins(response.data.admins);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
      setPage(response.data.currentPage);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      const errorMessage =
        error.response?.data?.message || "خطا در دریافت لیست ادمین‌ها";
      showMessage(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isSuperAdmin()) {
      fetchAdmins();
    }
  }, [isAuthenticated, isSuperAdmin]);

  // ایجاد ادمین جدید
  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingActions(["create"]);
      setError(null);

      const response = await api.post("/admin/admins", newAdmin);

      setShowCreateForm(false);
      setNewAdmin({ name: "", email: "", password: "" });
      fetchAdmins();

      showMessage(
        response.data.message || "ادمین با موفقیت ایجاد شد",
        "success"
      );
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const errorMessage =
        error.response?.data?.message || "خطا در ایجاد ادمین";
      showMessage(errorMessage, "error");
    } finally {
      setLoadingActions([]);
    }
  };

  // حذف ادمین
  const deleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`آیا از حذف ادمین "${adminName}" مطمئن هستید؟`)) {
      return;
    }

    try {
      setLoadingActions([adminId]);
      setError(null);

      await api.delete(`/admin/admins/${adminId}`);

      fetchAdmins();
      showMessage("ادمین با موفقیت حذف شد", "success");
    } catch (error: any) {
      console.error("Error deleting admin:", error);
      const errorMessage = error.response?.data?.message || "خطا در حذف ادمین";
      showMessage(errorMessage, "error");
    } finally {
      setLoadingActions([]);
    }
  };

  // تغییر وضعیت ادمین
  const toggleAdminStatus = async (
    adminId: string,
    currentStatus: boolean,
    adminName: string
  ) => {
    try {
      setLoadingActions([`status-${adminId}`]);
      setError(null);

      const response = await api.patch(`/admin/admins/${adminId}/status`);

      fetchAdmins();
      showMessage(
        response.data.message ||
          `ادمین ${!currentStatus ? "فعال" : "غیرفعال"} شد`,
        "success"
      );
    } catch (error: any) {
      console.error("Error toggling admin status:", error);
      const errorMessage =
        error.response?.data?.message || "خطا در تغییر وضعیت ادمین";
      showMessage(errorMessage, "error");
    } finally {
      setLoadingActions([]);
    }
  };

  // فیلتر ادمین‌ها بر اساس جستجو
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // اگر در حال لاودینگ احراز هویت هستیم - اضافه شد
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-300 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // اگر کاربر سوپر ادمین نیست، محتوای اصلی نمایش داده نمی‌شود - اضافه شد
  if (!isAuthenticated || !isSuperAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-300 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* نمایش پیام‌ها */}
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              error
                ? "bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200"
                : "bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{error || success}</span>
              <button
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                }}
                className="text-lg font-bold"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* هدر صفحه */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>بازگشت</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-amber-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    مدیریت ادمین‌ها
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    ایجاد، ویرایش و مدیریت دسترسی ادمین‌ها
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <UserPlus size={20} />
              <span>ایجاد ادمین جدید</span>
            </button>
          </div>

          {/* آمار */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    کل ادمین‌ها
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {total}
                  </p>
                </div>
                <Users className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ادمین‌های فعال
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {admins.filter((a) => a.isActive).length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ادمین‌های غیرفعال
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {admins.filter((a) => !a.isActive).length}
                  </p>
                </div>
                <ShieldOff className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* جستجو */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="جستجو بین ادمین‌ها (نام یا ایمیل)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* لیست ادمین‌ها */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredAdmins.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm
                  ? "ادمینی با مشخصات جستجو شده یافت نشد"
                  : "هنوز ادمینی ایجاد نکرده‌اید"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ادمین
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      تاریخ ایجاد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      آخرین ورود
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      اقدامات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAdmins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {admin.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {admin.isActive ? "فعال" : "غیرفعال"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(admin.createdAt).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleDateString(
                              "fa-IR"
                            )
                          : "هنوز وارد نشده"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 space-x-reverse">
                        <button
                          onClick={() =>
                            toggleAdminStatus(
                              admin._id,
                              admin.isActive,
                              admin.name
                            )
                          }
                          disabled={loadingActions.includes(
                            `status-${admin._id}`
                          )}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                            admin.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                          } transition-colors disabled:opacity-50`}
                        >
                          {loadingActions.includes(`status-${admin._id}`) ? (
                            "در حال پردازش..."
                          ) : admin.isActive ? (
                            <>
                              <ShieldOff size={14} className="ml-1" />
                              غیرفعال کردن
                            </>
                          ) : (
                            <>
                              <Shield size={14} className="ml-1" />
                              فعال کردن
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => deleteAdmin(admin._id, admin.name)}
                          disabled={loadingActions.includes(admin._id)}
                          className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {loadingActions.includes(admin._id) ? (
                            "در حال حذف..."
                          ) : (
                            <>
                              <Trash2 size={14} className="ml-1" />
                              حذف
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  نمایش {admins.length} از {total} ادمین
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => fetchAdmins(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  <span className="px-3 py-1 bg-amber-600 text-white rounded-md">
                    {page}
                  </span>
                  <button
                    onClick={() => fetchAdmins(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal ایجاد ادمین جدید */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              ایجاد ادمین جدید
            </h3>

            <form onSubmit={createAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  نام کامل
                </label>
                <input
                  type="text"
                  required
                  value={newAdmin.name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                  placeholder="نام و نام خانوادگی"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ایمیل
                </label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                  placeholder="example@domain.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  رمز عبور
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                  placeholder="حداقل ۶ کاراکتر"
                />
              </div>

              <div className="flex space-x-3 space-x-reverse pt-4">
                <button
                  type="submit"
                  disabled={loadingActions.includes("create")}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {loadingActions.includes("create")
                    ? "در حال ایجاد..."
                    : "ایجاد ادمین"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
  