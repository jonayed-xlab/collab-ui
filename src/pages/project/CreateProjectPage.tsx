import React from 'react';
import ProjectForm from '../../components/project/ProjectForm';

const CreateProjectPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <ProjectForm />
    </div>
  );
};

export default CreateProjectPage;