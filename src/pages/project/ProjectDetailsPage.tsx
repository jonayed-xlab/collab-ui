import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Trash2, Edit, UserPlus, Users } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import projectService from "../../services/projectService";
import userService from "../../services/userService";
import { User, Project } from "../../types";
import Card from "../../components/ui/Card";
import ProjectForm from "../../components/project/ProjectForm";

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [assignments, setAssignments] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    project: true,
    assignments: true,
    users: false, // initially false
  });
  const [error, setError] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({ ...loading, project: true, assignments: true });
        const projectId = Number(id);
        if (isNaN(projectId)) throw new Error("Invalid project ID");

        const [projectRes, assignmentsRes] = await Promise.all([
          projectService.getProjectById(projectId),
          projectService.getProjectAssignments(projectId),
        ]);

        if (projectRes.statusCode === "S200") {
          setProject(projectRes.data);
        } else {
          setError(projectRes.message || "Failed to load project");
        }

        if (assignmentsRes.statusCode === "S200") {
          setAssignments(assignmentsRes.data || []);
        } else {
          setError(assignmentsRes.message || "Failed to load assignments");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading({ ...loading, project: false, assignments: false });
      }
    };

    fetchData();
  }, [id]);

  // Fetch users only when opening Add Member modal
  const openAddMemberModal = async () => {
    setShowAddMemberModal(true);
    if (users.length === 0) {
      try {
        setLoading({ ...loading, users: true });
        const response = await userService.getAllUsers();
        if (response.statusCode === "S200") {
          setUsers(response.data || []);
        } else {
          setError(response.message || "Failed to load users");
        }
      } catch {
        setError("Error loading users");
      } finally {
        setLoading({ ...loading, users: false });
      }
    }
  };

  const memberForm = useFormik({
    initialValues: { userId: "" },
    validationSchema: Yup.object({
      userId: Yup.number().required("User is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await projectService.assignProject({
          projectId: Number(id),
          userId: Number(values.userId),
        });
        if (response.statusCode === "S200") {
          const res = await projectService.getProjectAssignments(Number(id));
          if (res.statusCode === "S200") {
            setAssignments(res.data || []);
          }
          setShowAddMemberModal(false);
          resetForm();
        } else {
          setError(response.message || "Failed to assign user");
        }
      } catch {
        setError("An error occurred while assigning user");
      }
    },
  });

  const handleRemoveMember = async (userId: number, projectId: number) => {
    try {
      const response = await projectService.deleteAssignment(userId, projectId);
      if (response.statusCode === "S200") {
        setAssignments(assignments.filter((a) => a.id !== userId));
      } else {
        setError(response.message || "Failed to remove member");
      }
    } catch {
      setError("An error occurred while removing member");
    }
  };

  const handleDeleteProject = async () => {
    try {
      const response = await projectService.deleteProject(Number(id));
      if (response.statusCode === "S200") {
        navigate("/projects");
      } else {
        setError(response.message || "Failed to delete project");
      }
    } catch {
      setError("An error occurred while deleting project");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const availableUsers = users.filter(
    // (user) => !assignments.some((a) => a.userId === user.id)
    (user) => !assignments.some((a) => a.id === user.id)
  );

  if (loading.project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">Project not found</p>
        <Link
          to="/projects"
          className="text-blue-600 hover:underline mt-4 block"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <div className="flex justify-between items-center">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="text-red-700">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Project Info */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Users className="mr-1 h-4 w-4" />
            <span>
              {assignments.length} member{assignments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300"
            onClick={() => setShowEditProjectModal(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Members Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Project Members</h2>
          <button
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={openAddMemberModal}
            disabled={loading.users}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>

        {loading.assignments ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No members assigned</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {/* {assignment.userId || "Unknown"} */}
                    Name: {assignment.name || "Unknown"}
                  </p>
                  <p className="font-small">
                    {/* {assignment.userId || "Unknown"} */}
                    Email: {assignment.email || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {assignment.role || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (
                      assignment.id !== undefined &&
                      project.id !== undefined
                    ) {
                      handleRemoveMember(assignment.id, project.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Remove member"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modals (Add Member, Edit, Delete) */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative bg-white rounded-md shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Add Member to Project
            </h3>
            <form onSubmit={memberForm.handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium mb-1"
                >
                  Select User
                </label>
                <select
                  id="userId"
                  name="userId"
                  value={memberForm.values.userId}
                  onChange={memberForm.handleChange}
                  onBlur={memberForm.handleBlur}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {memberForm.touched.userId && memberForm.errors.userId && (
                  <p className="text-red-500 text-sm mt-1">
                    {memberForm.errors.userId}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-200 px-3 py-2 text-sm rounded-md"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 px-3 py-2 text-sm text-white rounded-md"
                  disabled={memberForm.isSubmitting}
                >
                  {memberForm.isSubmitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* {showEditProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-lg relative">
            <h3 className="text-lg font-semibold mb-4">Edit Project</h3>
            <p>This is a placeholder for the edit project form.</p>
            <button
              className="mt-4 bg-gray-200 px-3 py-2 rounded-md"
              onClick={() => setShowEditProjectModal(false)}
            >
              Close
            </button>
            <button
              onClick={() => setShowEditProjectModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )} */}

      {showEditProjectModal && project && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowEditProjectModal(false)}
            >
              ×
            </button>
            <ProjectForm
              initialValues={{
                name: project.name,
                description: project.description,
              }}
              projectId={project.id}
              isEditing={true}
            />
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-lg font-semibold mb-4">Delete Project</h3>
            <p>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-200 px-3 py-2 rounded-md"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-3 py-2 text-white rounded-md"
                onClick={handleDeleteProject}
              >
                Delete Project
              </button>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
