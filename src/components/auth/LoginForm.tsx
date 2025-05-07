import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../utils/formSchemas";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting, setStatus }: any
  ) => {
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate("/");
      } else {
        setStatus("Invalid email or password");
      }
    } catch (error) {
      setStatus("An error occurred during login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="input"
                placeholder="you@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Field
                type="password"
                name="password"
                id="password"
                className="input"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="form-error"
              />
            </div>

            {status && (
              <div className="p-3 text-sm bg-error/10 text-error rounded-md">
                {status}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm text-text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
