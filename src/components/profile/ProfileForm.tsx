import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { profileSchema } from "../../utils/formSchemas";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../ui/Card";
import authService from "../../services/authService";

interface ProfileFormValues {
  name: string;
  email: string;
}

const ProfileForm: React.FC = () => {
  const { state, updateUser } = useAuth();

  const initialValues: ProfileFormValues = {
    name: state.user?.name || "",
    email: state.user?.email || "",
  };

  const handleSubmit = async (
    values: ProfileFormValues,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      if (!state.user) return;

      const name = values.name;

      const response = await authService.updateUser(state.user.id, {
        ...state.user,
        name: name,
        email: values.email,
      });

      if (response.statusCode === "S200" && response.data) {
        updateUser(response.data);
        setStatus({ success: true, message: "Profile updated successfully" });
      } else {
        setStatus({
          success: false,
          message: response.message || "Failed to update profile",
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: "An error occurred while updating profile",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                User Name
              </label>
              <Field type="text" name="name" id="name" className="input" />
              <ErrorMessage
                name="name"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <Field type="email" name="email" id="email" className="input" />
              <ErrorMessage
                name="email"
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
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default ProfileForm;
