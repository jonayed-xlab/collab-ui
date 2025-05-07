import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { projectSchema } from "../../utils/formSchemas";
import Card from "../ui/Card";
import projectService from "../../services/projectService";
import { useNavigate } from "react-router-dom";

interface ProjectFormValues {
  name: string;
  description: string;
}

interface ProjectFormProps {
  initialValues?: ProjectFormValues;
  projectId?: number;
  isEditing?: boolean;
}

export const PROJECT_STATUSES = [
  { value: "NEW", label: "New" },
  { value: "ON_TRACK", label: "On Track" },
  { value: "COMPLETED", label: "Completed" },
  { value: "AT_RISK", label: "At Risk" },
  { value: "OFF_TRACK", label: "Off Track" },
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialValues = { name: "", description: "" },
  projectId,
  isEditing = false,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: ProjectFormValues,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      let response;

      if (isEditing && projectId) {
        response = await projectService.updateProject(projectId, values);
      } else {
        response = await projectService.createProject(values);
      }

      if (response.statusCode === "S200" && response.data) {
        // navigate(`/projects/${response.data.id}`);
        navigate("/projects");
      } else {
        setStatus({
          success: false,
          message:
            response.message ||
            `Failed to ${isEditing ? "update" : "create"} project`,
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: `An error occurred while ${
          isEditing ? "updating" : "creating"
        } project`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Project" : "Create New Project"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={projectSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Project name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="input"
                placeholder="e.g., Team Collaboration Platform"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="form-error"
              />
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
                placeholder="Project details and goals..."
              />
              <ErrorMessage
                name="description"
                component="div"
                className="form-error"
              />
            </div>
            {isEditing && (
              <div>
                <Field as="select" name="status" id="status" className="input">
                  <option value="">Select status</option>
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Field>
              </div>
            )}

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
                onClick={() => navigate("/projects")}
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
                  ? "Update Project"
                  : "Create Project"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default ProjectForm;
