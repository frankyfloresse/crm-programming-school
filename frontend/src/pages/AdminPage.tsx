import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  managersService,
  type User,
  type CreateManagerDto,
  type OverallStatistics,
} from "../api/services/managers.service";
import axios from "axios";
import { Pagination } from "../components/Pagination";

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [managers, setManagers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActivationLinkModal, setShowActivationLinkModal] = useState(false);
  const [activationLink, setActivationLink] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [overallStats, setOverallStats] = useState<OverallStatistics | null>(
    null
  );
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || "1", 10);

  const setPage = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const fetchManagers = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await managersService.getManagers(page, 3);
      setManagers(response.managers);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (error: unknown) {
      console.error("Failed to fetch managers:", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to fetch managers");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOverallStatistics = async () => {
    setIsStatsLoading(true);
    try {
      const stats = await managersService.getOverallStatistics();
      setOverallStats(stats);
    } catch (error: unknown) {
      console.error("Failed to fetch overall statistics:", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to fetch overall statistics");
      }
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchOverallStatistics();
  }, []);

  const handleCreateManager = async (data: CreateManagerDto) => {
    try {
      const response = await managersService.createManager(data);
      alert("Manager created successfully!");

      // Set activation link and show modal
      setActivationLink(response.activationLink);
      setShowActivationLinkModal(true);

      setShowCreateModal(false);
    } catch (error: unknown) {
      console.error("Failed to create manager:", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to create manager");
      }
    }
  };

  const handleBanUser = async (userId: number) => {
    try {
      await managersService.banUser(userId);
      alert("Manager banned successfully!");
      fetchManagers(currentPage);
    } catch (error: unknown) {
      console.error("Failed to ban user:", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to ban user");
      }
    }
  };

  const handleUnbanUser = async (userId: number) => {
    try {
      await managersService.unbanUser(userId);
      alert("Manager unbanned successfully!");
      fetchManagers(currentPage);
    } catch (error: unknown) {
      console.error("Failed to unban user:", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to unban user");
      }
    }
  };

  const handleRecoveryPassword = async (userId: number) => {
    try {
      const response = await managersService.recoveryPassword(userId);
      const recoveryLink = `${window.location.origin}/activate/${response.token}`;

      // Set recovery link and show modal (reuse activation modal)
      setActivationLink(recoveryLink);
      setShowActivationLinkModal(true);
    } catch (error: unknown) {
      console.error("Failed to generate recovery link:", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to generate recovery link");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderStatistics = (
    stats: OverallStatistics | null,
    title?: string
  ) => {
    if (!stats || !stats.stats || stats.stats.length === 0) return null;

    return (
      <div className="mb-4">
        {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
        <div className="flex flex-wrap gap-4 p-4 bg-base-200 rounded-lg">
          {stats.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stat.count}
              </div>
              <div className="text-xs opacity-70">{stat.status || "-"}</div>
            </div>
          ))}
          <div className="text-center border-l pl-4">
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="text-xs opacity-70">Total</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-base-content/70">
              Manage managers and view statistics
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Manager
          </button>
        </div>
      </div>

      {/* Overall Statistics */}
      {isStatsLoading ? (
        <div className="flex justify-center py-4">
          <div className="loading loading-spinner loading-md"></div>
        </div>
      ) : (
        renderStatistics(overallStats, "Orders by Status")
      )}

      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Managers ({total})</h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Order Stats</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager) => (
                    <tr key={manager.id}>
                      <td>
                        <div>
                          <div className="font-bold">
                            {manager.firstName} {manager.lastName}
                          </div>
                        </div>
                      </td>
                      <td>{manager.email}</td>
                      <td>
                        <div className="flex gap-2">
                          <div
                            className={`badge badge-sm ${
                              manager.is_active
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {manager.is_active ? "Active" : "Inactive"}
                          </div>
                          {manager.is_banned && (
                            <div className="badge badge-sm badge-error">
                              Banned
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {manager.statistics?.byStatus &&
                        manager.statistics.byStatus.length > 0 ? (
                          <div className="text-sm">
                            <div className="space-y-1">
                              {manager.statistics.byStatus.map(
                                (stat, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center"
                                  >
                                    <span className="text-base-content/70">
                                      {stat.status}:
                                    </span>
                                    <span className="font-medium">
                                      {stat.count}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                            <div className="border-t border-base-300 mt-2 pt-2 flex justify-between items-center">
                              <span className="font-medium">Total:</span>
                              <span className="font-bold text-primary">
                                {manager.statistics.totalOrders}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-base-content/50">
                            No statistics
                          </div>
                        )}
                      </td>
                      <td>{formatDate(manager.createdAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          {!manager.is_active && (
                            <button
                              className="btn btn-xs btn-success"
                              onClick={() => handleRecoveryPassword(manager.id)}
                              title="Generate activation link"
                            >
                              Activate
                            </button>
                          )}

                          {manager.is_active && (
                            <button
                              className="btn btn-xs btn-warning"
                              onClick={() => handleRecoveryPassword(manager.id)}
                              title="Generate recovery link"
                            >
                              Recovery
                            </button>
                          )}

                          {!manager.is_banned ? (
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() =>
                                handleBanUser(manager.id)
                              }
                              title="Ban manager"
                            >
                              Ban
                            </button>
                          ) : (
                            <button
                              className="btn btn-xs btn-success"
                              onClick={() =>
                                handleUnbanUser(manager.id)
                              }
                              title="Unban manager"
                            >
                              Unban
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {managers.length === 0 && !isLoading && (
                <div className="text-center py-8 text-base-content/70">
                  No managers found
                </div>
              )}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Create Manager Modal */}
      {showCreateModal && (
        <CreateManagerModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateManager}
        />
      )}

      {/* Activation Link Modal */}
      {showActivationLinkModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Activation/Recovery Link Generated
            </h3>

            <div className="mb-6">
              <p className="text-sm text-base-content/70 mb-4">
                Please copy this link and send it to the manager:
              </p>
              <div className="mockup-code bg-base-200 p-4 rounded-lg">
                <pre className="text-xs break-all">
                  <code>{activationLink}</code>
                </pre>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigator.clipboard.writeText(activationLink);
                  alert("Activation link copied to clipboard!");
                }}
              >
                Copy Link
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowActivationLinkModal(false);
                  setActivationLink("");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Create Manager Modal Component
interface CreateManagerModalProps {
  onClose: () => void;
  onSubmit: (data: CreateManagerDto) => void;
}

function CreateManagerModal({ onClose, onSubmit }: CreateManagerModalProps) {
  const [formData, setFormData] = useState<CreateManagerDto>({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Create New Manager</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              Create Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
