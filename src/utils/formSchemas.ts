import * as Yup from 'yup';

// Login Schema
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

// Register Schema
export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Change Password Schema
export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters')
    .notOneOf([Yup.ref('oldPassword')], 'New password must be different from current password')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Profile Schema
export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'User name must be at least 2 characters')
    .required('User name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

// Project Schema
export const projectSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Project name must be at least 3 characters')
    .required('Project name is required'),
  description: Yup.string()
    .required('Project description is required'),
});

// Work Package Schema
export const workPackageSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .required('Title is required'),
  description: Yup.string()
    .required('Description is required'),
  workPackageType: Yup.string()
    .required('Work package type is required'),
  status: Yup.string()
    .required('Status is required'),
  priority: Yup.string()
    .required('Priority is required'),
  projectId: Yup.number()
    .required('Project ID is required'),
  startDate: Yup.date()
    .nullable(),
  endDate: Yup.date()
    .nullable()
    .min(Yup.ref('startDate'), 'End date must be after start date'),
});

// Comment Schema
export const commentSchema = Yup.object().shape({
  content: Yup.string()
    .required('Comment content is required'),
});