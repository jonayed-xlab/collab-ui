import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { changePasswordSchema } from "../../utils/formSchemas";
import Card from "../ui/Card";
import authService from "../../services/authService";

interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordForm: React.FC = () => {
  const initialValues: ChangePasswordValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (
    values: ChangePasswordValues,
    { setSubmitting, setStatus, resetForm }: any
  ) => {
    try {
      const response = await authService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      if (response.statusCode === "S200") {
        setStatus({ success: true, message: "Password changed successfully" });
        setTimeout(() => {
          resetForm();
          setStatus(undefined);
        }, 3000);
      } else {
        setStatus({
          success: false,
          message: response.message || "Failed to change password",
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: "An error occurred while changing password",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={changePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="label">
                Current password
              </label>
              <Field
                type="password"
                name="oldPassword"
                id="oldPassword"
                className="input"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="oldPassword"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="label">
                New password
              </label>
              <Field
                type="password"
                name="newPassword"
                id="newPassword"
                className="input"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm new password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="input"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="form-error"
              />
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

            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Changing password..." : "Change password"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default ChangePasswordForm;
