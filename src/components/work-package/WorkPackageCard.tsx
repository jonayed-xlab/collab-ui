import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import {
  WorkPackage,
  WorkPackagePriority,
  WorkPackageStatus,
} from "../../types";

interface WorkPackageCardProps {
  workPackage: WorkPackage;
  showProject?: boolean;
}

const WorkPackageCard: React.FC<WorkPackageCardProps> = ({
  workPackage,
  showProject = false,
}) => {
  const getStatusColor = (status: WorkPackageStatus) => {
    switch (status) {
      case WorkPackageStatus.NEW:
        return "bg-primary/10 text-primary";
      case WorkPackageStatus.IN_PROGRESS:
        return "bg-warning/10 text-warning";
      case WorkPackageStatus.COMPLETED:
        return "bg-success/10 text-success";
      case WorkPackageStatus.ON_HOLD:
        return "bg-text-muted/10 text-text-muted";
      case WorkPackageStatus.CLOSED:
        return "bg-success/10 text-success";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getPriorityColor = (priority: WorkPackagePriority) => {
    switch (priority) {
      case WorkPackagePriority.LOW:
        return "bg-text-muted/10 text-text-muted";
      case WorkPackagePriority.MEDIUM:
        return "bg-primary/10 text-primary";
      case WorkPackagePriority.HIGH:
        return "bg-warning/10 text-warning";
      case WorkPackagePriority.URGENT:
        return "bg-error/10 text-error";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link
            to={`/work-packages/${workPackage.id}`}
            className="text-lg font-medium text-text hover:text-primary"
          >
            {workPackage.title}
          </Link>
          <div className="flex gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(
                workPackage.status
              )}`}
            >
              {workPackage.status.replace("_", " ")}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(
                workPackage.priority
              )}`}
            >
              {workPackage.priority}
            </span>
          </div>
        </div>

        {showProject && (
          <div className="mb-2">
            <Link
              to={`/projects/${workPackage.projectId}`}
              className="text-sm text-primary hover:underline"
            >
              Project: {workPackage.projectName}
            </Link>
          </div>
        )}

        <p className="text-sm text-text-muted line-clamp-2 mb-4">
          {workPackage.description}
        </p>

        <div className="flex items-center justify-between text-xs text-text-muted">
          {workPackage.assignedToName && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>Assigned to: {workPackage.assignedToName}</span>
            </div>
          )}

          {workPackage.accountableToName && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>Assigned to: {workPackage.accountableToName}</span>
            </div>
          )}

          {workPackage.startDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(workPackage.startDate)}</span>
            </div>
          )}
        </div>
      </div>

      {workPackage.percentageComplete !== undefined && (
        <div className="px-4 py-2 border-t border-border bg-background">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium">Progress</span>
            <span className="text-xs font-medium">
              {workPackage.percentageComplete}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{ width: `${workPackage.percentageComplete}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkPackageCard;
