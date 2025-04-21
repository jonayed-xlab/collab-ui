import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const WorkPackageSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  workPackageType: Yup.string().required('Required'),
  assignedTo: Yup.number().required('Required'),
  accountableTo: Yup.number().required('Required'),
  estimateWork: Yup.string().required('Required'),
  remainingWork: Yup.string().required('Required'),
  spentWork: Yup.string().required('Required'),
  storyPoints: Yup.string().required('Required'),
  earnedStoryPoints: Yup.string().required('Required'),
  projectType: Yup.string().required('Required'),
  startDate: Yup.string().required('Required'),
  endDate: Yup.string().required('Required'),
  percentageComplete: Yup.number().required('Required').min(0).max(100),
  category: Yup.string().required('Required'),
  taskType: Yup.string().required('Required'),
  version: Yup.string().required('Required'),
  priority: Yup.string().required('Required'),
  repositoryName: Yup.string().required('Required'),
  branchName: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  projectId: Yup.number().required('Required'),
  isParentAvailable: Yup.boolean().required('Required'),
});

const WorkPackages = () => {
  const [workPackages, setWorkPackages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingWP, setEditingWP] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchWorkPackages = async () => {
    try {
      const response = await axios.get('/work-package');
      setWorkPackages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch work packages', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/project');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchWorkPackages();
    fetchProjects();
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this work package?')) return;
    try {
      await axios.delete(`/work-package/${id}`);
      fetchWorkPackages();
    } catch (error) {
      console.error('Failed to delete work package', error);
    }
  };

  const handleEdit = (wp) => {
    setEditingWP(wp);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingWP(null);
    setShowForm(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Work Packages</h2>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Work Package
            </button>
          </div>

          {showForm && (
            <div className="mb-6 bg-white p-4 rounded shadow overflow-auto max-h-[600px]">
              <Formik
                initialValues={{
                  title: editingWP?.title || '',
                  description: editingWP?.description || '',
                  workPackageType: editingWP?.workPackageType || '',
                  assignedTo: editingWP?.assignedTo || '',
                  accountableTo: editingWP?.accountableTo || '',
                  estimateWork: editingWP?.estimateWork || '',
                  remainingWork: editingWP?.remainingWork || '',
                  spentWork: editingWP?.spentWork || '',
                  storyPoints: editingWP?.storyPoints || '',
                  earnedStoryPoints: editingWP?.earnedStoryPoints || '',
                  projectType: editingWP?.projectType || '',
                  startDate: editingWP?.startDate ? editingWP.startDate.split('T')[0] : '',
                  endDate: editingWP?.endDate ? editingWP.endDate.split('T')[0] : '',
                  percentageComplete: editingWP?.percentageComplete || 0,
                  category: editingWP?.category || '',
                  taskType: editingWP?.taskType || '',
                  version: editingWP?.version || '',
                  priority: editingWP?.priority || '',
                  repositoryName: editingWP?.repositoryName || '',
                  branchName: editingWP?.branchName || '',
                  status: editingWP?.status || '',
                  projectId: editingWP?.projectId || '',
                  isParentAvailable: editingWP?.isParentAvailable || false,
                }}
                validationSchema={WorkPackageSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  try {
                    if (editingWP) {
                      await axios.put(`/work-package/${editingWP.id}`, values);
                    } else {
                      await axios.post('/work-package', values);
                    }
                    fetchWorkPackages();
                    resetForm();
                    setShowForm(false);
                    setEditingWP(null);
                  } catch (error) {
                    console.error('Failed to save work package', error);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block mb-1 font-semibold">
                        Title
                      </label>
                      <Field
                        type="text"
                        name="title"
                        id="title"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
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

                    <div>
                      <label htmlFor="workPackageType" className="block mb-1 font-semibold">
                        Work Package Type
                      </label>
                      <Field
                        as="select"
                        name="workPackageType"
                        id="workPackageType"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="TASK">TASK</option>
                        <option value="BUG">BUG</option>
                        <option value="FEATURE">FEATURE</option>
                      </Field>
                      <ErrorMessage
                        name="workPackageType"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="assignedTo" className="block mb-1 font-semibold">
                        Assigned To
                      </label>
                      <Field
                        as="select"
                        name="assignedTo"
                        id="assignedTo"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="assignedTo"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="accountableTo" className="block mb-1 font-semibold">
                        Accountable To
                      </label>
                      <Field
                        as="select"
                        name="accountableTo"
                        id="accountableTo"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="accountableTo"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="estimateWork" className="block mb-1 font-semibold">
                        Estimate Work
                      </label>
                      <Field
                        type="text"
                        name="estimateWork"
                        id="estimateWork"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="estimateWork"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="remainingWork" className="block mb-1 font-semibold">
                        Remaining Work
                      </label>
                      <Field
                        type="text"
                        name="remainingWork"
                        id="remainingWork"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="remainingWork"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="spentWork" className="block mb-1 font-semibold">
                        Spent Work
                      </label>
                      <Field
                        type="text"
                        name="spentWork"
                        id="spentWork"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="spentWork"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="storyPoints" className="block mb-1 font-semibold">
                        Story Points
                      </label>
                      <Field
                        type="text"
                        name="storyPoints"
                        id="storyPoints"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="storyPoints"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="earnedStoryPoints" className="block mb-1 font-semibold">
                        Earned Story Points
                      </label>
                      <Field
                        type="text"
                        name="earnedStoryPoints"
                        id="earnedStoryPoints"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="earnedStoryPoints"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="projectType" className="block mb-1 font-semibold">
                        Project Type
                      </label>
                      <Field
                        type="text"
                        name="projectType"
                        id="projectType"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="projectType"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="startDate" className="block mb-1 font-semibold">
                        Start Date
                      </label>
                      <Field
                        type="date"
                        name="startDate"
                        id="startDate"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="startDate"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="endDate" className="block mb-1 font-semibold">
                        End Date
                      </label>
                      <Field
                        type="date"
                        name="endDate"
                        id="endDate"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="endDate"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="percentageComplete" className="block mb-1 font-semibold">
                        Percentage Complete
                      </label>
                      <Field
                        type="number"
                        name="percentageComplete"
                        id="percentageComplete"
                        min="0"
                        max="100"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="percentageComplete"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block mb-1 font-semibold">
                        Category
                      </label>
                      <Field
                        type="text"
                        name="category"
                        id="category"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="taskType" className="block mb-1 font-semibold">
                        Task Type
                      </label>
                      <Field
                        type="text"
                        name="taskType"
                        id="taskType"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="taskType"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="version" className="block mb-1 font-semibold">
                        Version
                      </label>
                      <Field
                        type="text"
                        name="version"
                        id="version"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="version"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="priority" className="block mb-1 font-semibold">
                        Priority
                      </label>
                      <Field
                        as="select"
                        name="priority"
                        id="priority"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Priority</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </Field>
                      <ErrorMessage
                        name="priority"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="repositoryName" className="block mb-1 font-semibold">
                        Repository Name
                      </label>
                      <Field
                        type="text"
                        name="repositoryName"
                        id="repositoryName"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="repositoryName"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="branchName" className="block mb-1 font-semibold">
                        Branch Name
                      </label>
                      <Field
                        type="text"
                        name="branchName"
                        id="branchName"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="branchName"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="status" className="block mb-1 font-semibold">
                        Status
                      </label>
                      <Field
                        as="select"
                        name="status"
                        id="status"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Status</option>
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="CLOSED">CLOSED</option>
                        <option value="IN_UAT">IN_UAT</option>
                        <option value="TESTED">TESTED</option>
                        <option value="PR_REVIEW">PR_REVIEW</option>
                        <option value="READY_FOR_UAT">READY_FOR_UAT</option>
                        <option value="READY_FOR_DEPLOYMENT">READY FOR DEPLOYMENT</option>
                        <option value="SCHEDULED_TODO">SCHEDULED_TODO</option>
                        <option value="DEVELOPED">DEVELOPED</option>
                        <option value="READY_FOR_TESTING">READY_FOR_TESTING</option>
                        <option value="ON_HOLD">ON_HOLD</option>
                        <option value="REJECTED">REJECTED</option>

                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="col-span-full flex items-center space-x-4 mt-4">
                      <label className="flex items-center space-x-2">
                        <Field
                          type="checkbox"
                          name="isParentAvailable"
                          checked={values.isParentAvailable}
                          onChange={() =>
                            setFieldValue('isParentAvailable', !values.isParentAvailable)
                          }
                        />
                        <span>Is Parent Available</span>
                      </label>
                    </div>

                    <div>
                      <label htmlFor="projectId" className="block mb-1 font-semibold">
                        Project
                      </label>
                      <Field
                        as="select"
                        name="projectId"
                        id="projectId"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="projectId"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="col-span-full flex space-x-4 mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingWP(null);
                        }}
                        className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Assigned To</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workPackages.map((wp) => (
                <tr key={wp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{wp.title}</td>
                  <td className="p-3">{wp.description}</td>
                  <td className="p-3">{wp.status}</td>
                  <td className="p-3">
                    {users.find((u) => u.id === wp.assignedTo)?.name || 'N/A'}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(wp)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(wp.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {workPackages.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No work packages found.
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

export default WorkPackages;
