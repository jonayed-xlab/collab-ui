import React from 'react';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';

const ChangePasswordPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Change Password</h1>
      </div>

      <ChangePasswordForm />
    </div>
  );
};

export default ChangePasswordPage;