import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProjectSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
});

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [assigningProject, setAssigningProject] = useState(null);
  const [assignUserId, setAssignUserId] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/project');
      console.log(response.data);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`/project/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleAssign = (project) => {
    setAssigningProject(project);
    setAssignUserId('');
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignUserId) return;
    try {
      await axios.post('/project/assign', {
        projectId: assigningProject.id,
        userId: parseInt(assignUserId),
      });
      setAssigningProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Failed to assign project', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Project
            </button>
          </div>

          {showForm && (
            <div className="mb-6 bg-white p-4 rounded shadow">
              <Formik
                initialValues={{
                  name: editingProject?.name || '',
                  description: editingProject?.description || '',
                }}
                validationSchema={ProjectSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  try {
                    if (editingProject) {
                      await axios.put(`/project/${editingProject.id}`, values);
                    } else {
                      await axios.post('/project', values);
                    }
                    fetchProjects();
                    resetForm();
                    setShowForm(false);
                    setEditingProject(null);
                  } catch (error) {
                    console.error('Failed to save project', error);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label htmlFor="name" className="block mb-1 font-semibold">
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block mb-1 font-semibold">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        id="description"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingProject(null);
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {assigningProject && (
            <div className="mb-6 bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">
                Assign Project: {assigningProject.name}
              </h3>
              <form onSubmit={handleAssignSubmit}>
                <select
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Assign
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssigningProject(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{project.name}</td>
                  <td className="p-3">{project.description}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleAssign(project)}
                      className="text-green-600 hover:underline"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default Projects;
