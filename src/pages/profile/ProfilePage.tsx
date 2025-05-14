import React from "react";
import ProfileForm from "../../components/profile/ProfileForm";

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
