import React, { useState, useEffect } from "react";
import { Search, X, Trash2, Edit } from "lucide-react";
import Card from "../../components/ui/Card";
import userService, { User } from "../../services/userService";

interface MemberFormData {
  email: string;
  role: string;
}

const MembersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("MEMBER");
  const [showAddMember, setShowAddMember] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    email: "",
    role: "MEMBER",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response.statusCode === "S200") {
        setMembers(response.data || []);
      } else {
        setError("Failed to fetch members");
      }
    } catch (err) {
      setError("An error occurred while fetching members");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (
    userId: number,
    role: string,
    active: boolean
  ) => {
    try {
      const response = await userService.updateUser(userId, { role, active });
      if (response.statusCode === "S200" && response.data) {
        fetchMembers();
      } else {
        setTimeout(() => {
          setError("Failed to update user");
        }, 3000);
      }
    } catch (err) {
      setError("An error occurred while updating user");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await userService.deleteUser(userId);
      if (response.statusCode === "S200") {
        fetchMembers();
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        setError(null);
      } else {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        setError(response.message || "Failed to delete user");
      }
    } catch (err) {
      setError("An error occurred while deleting user");
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async () => {
    // This would connect to your addUser API if required
    // For now just closing the form
    setShowAddMember(false);
    setFormData({ email: "", role: "MEMBER" });
  };

  const filteredMembers = members.filter(
    (member) =>
      (member.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (member.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // Helper function to get initials from name
  const getInitials = (name: string | null): string => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Function to map API roles to display roles
  const formatRole = (role: string | null): string => {
    if (!role) return "Member";
    switch (role) {
      case "PROJECT_MANAGER":
        return "Project Manager";
      case "DEVELOPER":
        return "Developer";
      case "QUALITY_ASSURANCE":
        return "Quality Assurance";
      case "ADMIN":
        return "Admin";
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error text-error rounded">
          {error}
          <button className="float-right" onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <Card>
        {showAddMember && (
          <div className="mb-6 border-b border-border pb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">
                Add existing users or groups
              </h2>
              <button
                className="text-text-muted hover:text-text"
                onClick={() => setShowAddMember(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    name="email"
                    className="input pl-10"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="w-48">
                <select
                  className="input"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="MEMBER">Member</option>
                  <option value="READER">Reader</option>
                  <option value="ADMIN">Project admin</option>
                </select>
              </div>

              <button className="btn-primary" onClick={handleAddMember}>
                Add
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              className="input pl-10"
              placeholder="Filter members"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center">Loading members...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">
                      No members found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <React.Fragment key={member.id}>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                              {getInitials(member.name)}
                            </div>
                            <span>{member.name || "Unnamed User"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {member.email || "No email"}
                        </td>
                        <td className="py-3 px-4">{formatRole(member.role)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.active
                                ? "bg-success/10 text-success"
                                : "bg-error/10 text-error"
                            }`}
                          >
                            {member.active ? "active" : "inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                          <button
                            className="px-3 py-1 text-sm rounded border hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center"
                            onClick={() => {
                              setEditingUser(member);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit size={16} className="mr-1" /> Edit
                          </button>
                          <button
                            className="px-3 py-1 text-sm rounded border hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                            onClick={() => {
                              setUserToDelete(member);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 size={16} className="mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                      {editingUser?.id === member.id && isEditModalOpen && (
                        <tr className="border-b border-border bg-gray-50">
                          <td className="py-3 px-4" colSpan={5}>
                            <div className="flex items-center gap-4">
                              <div>{editingUser.name || "No Name"}</div>
                              <div>{editingUser.email || "No email"}</div>
                              <select
                                className="input"
                                value={editingUser.role || "MEMBER"}
                                onChange={(e) =>
                                  setEditingUser((prev) =>
                                    prev
                                      ? { ...prev, role: e.target.value }
                                      : prev
                                  )
                                }
                              >
                                <option value="DEVELOPER">Developer</option>
                                <option value="QUALITY_ASSURANCE">
                                  Quality Assurance
                                </option>
                                <option value="PROJECT_MANAGER">
                                  Project Manager
                                </option>
                                <option value="ADMIN">Admin</option>
                              </select>
                              <label className="inline-flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  checked={editingUser.active}
                                  onChange={(e) =>
                                    setEditingUser((prev) =>
                                      prev
                                        ? { ...prev, active: e.target.checked }
                                        : prev
                                    )
                                  }
                                />
                                <span>Active</span>
                              </label>
                              <div className="flex gap-2">
                                <button
                                  className="btn-primary btn-sm"
                                  onClick={() => {
                                    if (editingUser) {
                                      handleUpdateUser(
                                        editingUser.id,
                                        editingUser.role || "DEVELOPER",
                                        editingUser.active
                                      );
                                      setIsEditModalOpen(false);
                                      setEditingUser(null);
                                    }
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn-secondary btn-sm"
                                  onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditingUser(null);
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete user{" "}
              <span className="font-bold">{userToDelete.name}</span> (
              {userToDelete.email})? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary btn-sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm rounded border hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                onClick={() => handleDeleteUser(userToDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
