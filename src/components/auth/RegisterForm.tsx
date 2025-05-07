import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../utils/formSchemas';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    values: { name: string; email: string; password: string; confirmPassword: string },
    { setSubmitting, setStatus }: any
  ) => {
    try {
      const success = await register(values.name, values.email, values.password);
      if (success) {
        // navigate('/');
        navigate('/login', {
          state: { successMessage: 'Registration successful! Please log in.' },
        });
      } else {
        setStatus('Registration failed. Please try again.');
      }
    } catch (error) {
      setStatus('An error occurred during registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
      validationSchema={registerSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor="name" className="label">Full Name</label>
            <Field
              type="text"
              name="name"
              id="name"
              className="input"
              placeholder="John Doe"
            />
            <ErrorMessage name="name" component="div" className="form-error" />
          </div>

          <div>
            <label htmlFor="email" className="label">Email</label>
            <Field
              type="email"
              name="email"
              id="email"
              className="input"
              placeholder="you@example.com"
            />
            <ErrorMessage name="email" component="div" className="form-error" />
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <Field
              type="password"
              name="password"
              id="password"
              className="input"
              placeholder="••••••••"
            />
            <ErrorMessage name="password" component="div" className="form-error" />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">Confirm Password</label>
            <Field
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="input"
              placeholder="••••••••"
            />
            <ErrorMessage name="confirmPassword" component="div" className="form-error" />
          </div>

          {status && <div className="p-3 text-sm bg-error/10 text-error rounded-md">{status}</div>}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>

          <div className="text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;