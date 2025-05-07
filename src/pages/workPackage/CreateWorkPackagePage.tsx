import React from 'react';
import { useParams } from 'react-router-dom';
import WorkPackageForm from '../../components/work-package/WorkPackageForm';

const CreateWorkPackagePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Work Package</h1>
      <WorkPackageForm projectId={projectId ? parseInt(projectId) : undefined} />
    </div>
  );
};

export default CreateWorkPackagePage;