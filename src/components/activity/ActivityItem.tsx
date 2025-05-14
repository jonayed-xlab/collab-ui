import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, CircleDot, Bug, FileText, Clock } from "lucide-react";
import { FieldChangeLog } from "../../types";

interface ActivityItemProps {
  activity: FieldChangeLog;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = () => {
    const type = activity.entityType.toLowerCase();

    if (type.includes("bug")) return <Bug size={18} className="text-red-500" />;
    if (type.includes("task"))
      return <CircleDot size={18} className="text-blue-500" />;
    if (type.includes("project"))
      return <FileText size={18} className="text-indigo-500" />;
    if (type.includes("time"))
      return <Clock size={18} className="text-amber-500" />;

    return <CheckCircle size={18} className="text-green-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getEntityUrl = () => {
    const type = activity.entityType.toLowerCase();
    const id = activity.entityId;

    if (type.includes("bug") || type.includes("task"))
      return `/work-packages/${id}`;
    if (type.includes("project")) return `/projects/${id}`;
    return "#";
  };

  const formatFieldName = (fieldName?: string | null) => {
    if (!fieldName) return "";

    const formatted = fieldName.replace(/([A-Z])/g, " $1").trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const isCreation = !activity.oldValue;

  return (
    <div className="flex gap-4 relative group">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div className="bg-background border border-border rounded-full p-1">
          {getActivityIcon()}
        </div>
        <div className="w-0.5 bg-border h-full mt-1 group-last:hidden" />
      </div>

      {/* Content card */}
      <div className="flex-1 mb-4">
        <div className="border border-border rounded-xl p-4 bg-white hover:shadow transition-shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                {activity.name}
              </div>
              <p className="text-sm font-medium">
                {isCreation ? "Created by" : "Updated by"} {activity.name}
              </p>
            </div>
            <span className="text-xs text-text-muted">
              {formatDate(activity.updatedAt)}
            </span>
          </div>

          <p className="text-sm mb-2">
            {activity.entityType}{" "}
            <Link
              to={getEntityUrl()}
              className="text-primary font-medium hover:underline"
            >
              {activity.entityName || `#${activity.entityId}`}
            </Link>
          </p>

          <div className="text-xs text-text-muted bg-muted p-2 rounded-md">
            {activity.fieldName ? (
              isCreation ? (
                <>
                  <span>Set {formatFieldName(activity.fieldName)} to </span>
                  <span className="text-green-600">
                    {activity.newValue ?? "—"}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Changed {formatFieldName(activity.fieldName)} from{" "}
                  </span>
                  <span className="line-through">
                    {activity.oldValue ?? "—"}
                  </span>
                  <span> to </span>
                  <span className="text-green-600">
                    {activity.newValue ?? "—"}
                  </span>
                </>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
