import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  WorkPackage,
  WorkPackageType,
  WorkPackageStatus,
  WorkPackagePriority,
} from "../../types";
import workPackageService from "../../services/workPackageService";
import Card from "../ui/Card";

interface WorkPackageFormProps {
  initialValues?: Partial<WorkPackage>;
  workPackageId?: number;
  isEditing?: boolean;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  workPackageType: Yup.string().required("Type is required"),
  status: Yup.string().required("Status is required"),
  priority: Yup.string().required("Priority is required"),
});

const WorkPackageForm: React.FC<WorkPackageFormProps> = ({
  initialValues = {
    title: "",
    description: "",
    workPackageType: WorkPackageType.TASK,
    status: WorkPackageStatus.NEW,
    priority: WorkPackagePriority.MEDIUM,
  },
  workPackageId,
  isEditing = false,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: Partial<WorkPackage>,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      const response =
        isEditing && workPackageId
          ? await workPackageService.updateWorkPackage(workPackageId, values)
          : await workPackageService.createWorkPackage(values);

      if (response.statusCode === "S200" && response.data) {
        navigate(`/work-packages/${response.data.id}`);
      } else {
        setStatus({
          error:
            response.message ||
            `Failed to ${isEditing ? "update" : "create"} work package`,
        });
      }
    } catch (error) {
      setStatus({
        error: `An error occurred while ${
          isEditing ? "updating" : "creating"
        } work package`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? "Edit Work Package" : "Create Work Package"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-6">
            <div>
              <label className="label">Title</label>
              <Field
                type="text"
                name="title"
                className="input"
                placeholder="Enter work package title"
              />
            </div>

            <div>
              <label className="label">Description</label>
              <Field
                as="textarea"
                name="description"
                className="input min-h-[100px]"
                placeholder="Enter work package description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Type</label>
                <Field as="select" name="workPackageType" className="input">
                  {Object.values(WorkPackageType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <label className="label">Status</label>
                <Field as="select" name="status" className="input">
                  {Object.values(WorkPackageStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <label className="label">Priority</label>
                <Field as="select" name="priority" className="input">
                  {Object.values(WorkPackagePriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date</label>
                <Field
                  type="datetime-local"
                  name="startDate"
                  className="input"
                />
              </div>

              <div>
                <label className="label">End Date</label>
                <Field type="datetime-local" name="endDate" className="input" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Estimated Work (hours)</label>
                <Field
                  type="number"
                  name="estimateWork"
                  className="input"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="label">Remaining Work (hours)</label>
                <Field
                  type="number"
                  name="remainingWork"
                  className="input"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="label">Spent Time (hours)</label>
                <Field
                  type="number"
                  name="spentWork"
                  className="input"
                  placeholder="0"
                />
              </div>
            </div>

            {status?.error && (
              <div className="bg-error/10 text-error p-3 rounded-md">
                {status.error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/work-packages")}
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
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default WorkPackageForm;
