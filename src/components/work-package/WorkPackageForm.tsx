import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { workPackageSchema } from "../../utils/formSchemas";
import Card from "../ui/Card";
import {
  WorkPackage,
  WorkPackageStatus,
  WorkPackagePriority,
  WorkPackageType,
  Project,
  User,
} from "../../types";
import workPackageService from "../../services/workPackageService";
import projectService from "../../services/projectService";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

interface WorkPackageFormProps {
  initialValues?: Partial<WorkPackage>;
  workPackageId?: number;
  isEditing?: boolean;
  projectId?: number;
}

const WorkPackageForm: React.FC<WorkPackageFormProps> = ({
  initialValues = {
    title: "",
    description: "",
    workPackageType: WorkPackageType.TASK,
    priority: WorkPackagePriority.MEDIUM,
    status: WorkPackageStatus.NEW,
    projectId: 0,
  },
  workPackageId,
  isEditing = false,
  projectId,
}) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, usersResponse] = await Promise.all([
          projectService.getAllProjects(),
          authService.getAllUsers(),
        ]);

        if (projectsResponse.statusCode === "S200" && projectsResponse.data) {
          setProjects(projectsResponse.data);
        }

        if (usersResponse.statusCode === "S200" && usersResponse.data) {
          setUsers(usersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, []);

  // If projectId is provided, set it in the form values
  useEffect(() => {
    if (projectId && !isEditing) {
      initialValues.projectId = projectId;
    }
  }, [projectId, isEditing, initialValues]);

  const handleSubmit = async (
    values: Partial<WorkPackage>,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      let response;

      if (isEditing && workPackageId) {
        response = await workPackageService.updateWorkPackage(
          workPackageId,
          values
        );
      } else {
        response = await workPackageService.createWorkPackage(values);
      }

      if (response.statusCode === "S200" && response.data) {
        if (values.projectId) {
          navigate(
            `/projects/${values.projectId}/work-packages/${response.data.id}`
          );
        } else {
          navigate(`/work-packages/${response.data.id}`);
        }
      } else {
        setStatus({
          success: false,
          message:
            response.message ||
            `Failed to ${isEditing ? "update" : "create"} work package`,
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: `An error occurred while ${
          isEditing ? "updating" : "creating"
        } work package`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Work Package" : "Create New Work Package"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={workPackageSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="title" className="label">
                Title
              </label>
              <Field
                type="text"
                name="title"
                id="title"
                className="input"
                placeholder="e.g., Implement User Authentication"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="form-error"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="workPackageType" className="label">
                  Type
                </label>
                <Field
                  as="select"
                  name="workPackageType"
                  id="workPackageType"
                  className="input"
                >
                  {Object.values(WorkPackageType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="workPackageType"
                  component="div"
                  className="form-error"
                />
              </div>

              <div>
                <label htmlFor="projectId" className="label">
                  Project
                </label>
                <Field
                  as="select"
                  name="projectId"
                  id="projectId"
                  className="input"
                  disabled={!!projectId}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="projectId"
                  component="div"
                  className="form-error"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                className="input h-32"
                placeholder="Detailed description of the work package..."
              />
              <ErrorMessage
                name="description"
                component="div"
                className="form-error"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <Field as="select" name="status" id="status" className="input">
                  {Object.values(WorkPackageStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="form-error"
                />
              </div>

              <div>
                <label htmlFor="priority" className="label">
                  Priority
                </label>
                <Field
                  as="select"
                  name="priority"
                  id="priority"
                  className="input"
                >
                  {Object.values(WorkPackagePriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="form-error"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="assignedTo" className="label">
                  Assigned To
                </label>
                <Field
                  as="select"
                  name="assignedTo"
                  id="assignedTo"
                  className="input"
                >
                  <option value="">Not assigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="assignedTo"
                  component="div"
                  className="form-error"
                />
              </div>

              <div>
                <label htmlFor="accountableTo" className="label">
                  Accountable To
                </label>
                <Field
                  as="select"
                  name="accountableTo"
                  id="accountableTo"
                  className="input"
                >
                  <option value="">Not assigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="accountableTo"
                  component="div"
                  className="form-error"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="label">
                  Start Date
                </label>
                <Field
                  type="datetime-local"
                  name="startDate"
                  id="startDate"
                  className="input"
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="form-error"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="label">
                  End Date
                </label>
                <Field
                  type="datetime-local"
                  name="endDate"
                  id="endDate"
                  className="input"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="form-error"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="estimateWork" className="label">
                  Estimated Time
                </label>
                <Field
                  type="text"
                  name="estimateWork"
                  id="estimateWork"
                  className="input"
                  placeholder="e.g., 8h"
                />
                <ErrorMessage
                  name="estimateWork"
                  component="div"
                  className="form-error"
                />
              </div>

              <div>
                <label htmlFor="remainingWork" className="label">
                  Remaining Time
                </label>
                <Field
                  type="text"
                  name="remainingWork"
                  id="remainingWork"
                  className="input"
                  placeholder="e.g., 8h"
                />
                <ErrorMessage
                  name="remainingWork"
                  component="div"
                  className="form-error"
                />
              </div>

              <div>
                <label htmlFor="spentWork" className="label">
                  Spent Time
                </label>
                <Field
                  type="text"
                  name="spentWork"
                  id="spentWork"
                  className="input"
                  placeholder="e.g., 0h"
                />
                <ErrorMessage
                  name="spentWork"
                  component="div"
                  className="form-error"
                />
              </div>
            </div>

            {status && (
              <div
                className={`p-3 text-sm rounded-md ${
                  status.success
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  navigate(
                    projectId
                      ? `/projects/${projectId}/work-packages`
                      : "/work-packages"
                  )
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Work Package"
                  : "Create Work Package"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default WorkPackageForm;
