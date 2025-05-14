import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import projectService from "../../services/projectService";
import userService from "../../services/userService";
import { User, Project, ProjectAssignment } from "../../types";

const AssignUserToProjectPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [loading, setLoading] = useState({
    page: true,
    form: false,
    assignments: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<number | null>(null);

  // Fetch all necessary data
  useEffect(() => {
    console.log("fetching data");
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, page: true }));

        const [usersResponse, projectsResponse] = await Promise.all([
          userService.getAllUsers(),
          projectService.getAllProjects(),
          //   projectService.getAllAssignments()
        ]);

        if (usersResponse.statusCode === "S200")
          setUsers(usersResponse.data || []);
        if (projectsResponse.statusCode === "S200")
          setProjects(projectsResponse.data || []);
        // if (assignmentsResponse.statusCode === "S200") setAssignments(assignmentsResponse.data || []);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading((prev) => ({ ...prev, page: false }));
      }
    };

    fetchData();
  }, []);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    projectId: Yup.number().required("Project is required"),
    userId: Yup.number().required("User is required"),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      projectId: "",
      userId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading((prev) => ({ ...prev, form: true }));
        setError(null);
        setSuccess(null);

        const response = editMode
          ? await projectService.updateAssignment(editMode, {
              projectId: Number(values.projectId),
              userId: Number(values.userId),
            })
          : await projectService.assignProject({
              projectId: Number(values.projectId),
              userId: Number(values.userId),
            });

        if (response.statusCode === "S200") {
          setSuccess(
            editMode
              ? "Assignment updated successfully"
              : "User successfully assigned to project"
          );

          // Refresh assignments
          const assignmentsResponse = await projectService.getAllAssignments();
          if (assignmentsResponse.statusCode === "S200") {
            setAssignments(assignmentsResponse.data || []);
          }

          formik.resetForm();
          setEditMode(null);
        } else {
          setError(response.message || "Operation failed");
        }
      } catch (err) {
        setError("An error occurred while processing your request");
      } finally {
        setLoading((prev) => ({ ...prev, form: false }));
      }
    },
  });

  // Handle edit assignment
  const handleEdit = (assignment: ProjectAssignment) => {
    setEditMode(assignment.id);
    formik.setValues({
      projectId: String(assignment.projectId),
      userId: String(assignment.userId),
    });
  };

  // Handle delete assignment
  const handleDelete = async (assignment: ProjectAssignment) => {
    try {
      setLoading((prev) => ({ ...prev, assignments: true }));
      const response = await projectService.deleteAssignment(
        assignment.userId,
        assignment.projectId
      );

      if (response.statusCode === "S200") {
        setSuccess("Assignment removed successfully");
        setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
      } else {
        setError(response.message || "Failed to remove assignment");
      }
    } catch (err) {
      setError("An error occurred while removing assignment");
    } finally {
      setLoading((prev) => ({ ...prev, assignments: false }));
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditMode(null);
    formik.resetForm();
  };

  if (loading.page) {
    return (
      <div className="container mx-auto p-6 max-w-4xl flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Manage Project Assignments</h1>

      {/* Status Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex justify-between items-center">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <div className="flex justify-between items-center">
            <p>{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-700 hover:text-green-900"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Assignment Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? "Edit Assignment" : "Create New Assignment"}
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Project Select */}
            <div>
              <label
                htmlFor="projectId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project
              </label>
              <select
                id="projectId"
                name="projectId"
                value={formik.values.projectId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.projectId && formik.errors.projectId
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {formik.touched.projectId && formik.errors.projectId && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.projectId}
                </p>
              )}
            </div>

            {/* User Select */}
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                User
              </label>
              <select
                id="userId"
                name="userId"
                value={formik.values.userId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.userId && formik.errors.userId
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {formik.touched.userId && formik.errors.userId && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.userId}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {editMode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading.form || !formik.isValid}
              className={`px-4 py-2 rounded-md text-white ${
                loading.form || !formik.isValid
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } flex items-center justify-center`}
            >
              {loading.form ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : editMode ? (
                "Update Assignment"
              ) : (
                "Assign User"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Current Assignments Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>

        {loading.assignments ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No assignments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => {
                  const project = projects.find(
                    (p) => p.id === assignment.projectId
                  );
                  const user = users.find((u) => u.id === assignment.userId);

                  return (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project?.name || "Unknown Project"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.name || "Unknown User"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(assignment)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignUserToProjectPage;
