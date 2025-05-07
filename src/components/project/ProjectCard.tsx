import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
}

function getDaysAgo(dateString: string) {
  const updatedDate = new Date(dateString);
  const today = new Date();

  // Clear the time for accurate day diff
  updatedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - updatedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 0
    ? "today"
    : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4">
          <h3 className="text-lg font-medium text-text mb-2">{project.name}</h3>
          <p className="text-sm text-text-muted line-clamp-2 mb-4">
            {project.description}
          </p>

          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{project.totalMembers} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                Updated{" "}
                {project.updatedAt ? getDaysAgo(project.updatedAt) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {project.status && (
          <div className="px-4 py-2 border-t border-border bg-background">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Status</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  project.status === "ON_TRACK"
                    ? "bg-success/10 text-success"
                    : project.status === "AT_RISK"
                    ? "bg-warning/10 text-warning"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
