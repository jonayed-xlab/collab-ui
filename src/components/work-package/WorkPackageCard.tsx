import React from "react";
import { Link } from "react-router-dom";
import { WorkPackage } from "../../types";
import {
  FileText,
  GitBranch,
  GitPullRequest,
  Layers,
  ListTree,
} from "lucide-react";

interface WorkPackageCardProps {
  workPackage: WorkPackage;
  showProject?: boolean;
}

const WorkPackageCard: React.FC<WorkPackageCardProps> = ({
  workPackage,
  showProject = false,
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ON_HOLD":
        return "bg-gray-100 text-gray-800";
      case "CLOSED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EPIC":
        return <Layers size={14} className="mr-1" />;
      case "STORY":
        return <ListTree size={14} className="mr-1" />;
      case "FEATURE":
        return <GitPullRequest size={14} className="mr-1" />;
      case "BUG":
        return <GitBranch size={14} className="mr-1" />;
      default:
        return <FileText size={14} className="mr-1" />;
    }
  };

  return (
    <Link to={`/work-packages/${workPackage.id}`}>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow h-full">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusClass(
              workPackage.status
            )}`}
          >
            {workPackage.status.replace("_", " ")}
          </span>
          <span className="text-xs text-gray-500">#{workPackage.id}</span>
        </div>
        <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
          {getTypeIcon(workPackage.workPackageType)}
          {workPackage.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {workPackage.description || "No description"}
        </p>
        {showProject && workPackage.projectName && (
          <div className="text-xs text-gray-500">
            Project: {workPackage.projectName}
          </div>
        )}
      </div>
    </Link>
  );
};

export default WorkPackageCard;
