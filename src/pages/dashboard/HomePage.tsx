import { Briefcase, FileText, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard2 from "../../components/project/ProjectCard2";
import Card from "../../components/ui/Card";
import WorkPackageCard from "../../components/work-package/WorkPackageCard";
import { useAuth } from "../../contexts/AuthContext";
import projectService from "../../services/projectService";
import workPackageService from "../../services/workPackageService";
import { Project, WorkPackageResponse } from "../../types";

const HomePage: React.FC = () => {
  const { state } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [workPackages, setWorkPackages] = useState<WorkPackageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (state.user) {
          const [projectsResponse, workPackagesResponse] = await Promise.all([
            projectService.getUserProjects(state.user.id),
            workPackageService.getUserWorkPackages(state.user.id),
          ]);

          if (projectsResponse.statusCode === "S200" && projectsResponse.data) {
            setProjects(projectsResponse.data.slice(0, 3));
          }

          if (
            workPackagesResponse.statusCode === "S200" &&
            workPackagesResponse.data
          ) {
            setWorkPackages(workPackagesResponse.data.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [state.user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome to CollabSuite!</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects section */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase size={20} />
                <span>Projects</span>
              </h2>
              <Link to="/projects/create" className="btn-primary">
                <Plus size={16} className="mr-1" />
                New Project
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase size={48} className="mx-auto mb-4 text-text-muted" />
                <p className="text-text-muted mb-4">
                  You don't have any projects yet.
                </p>
                <Link to="/projects/create" className="btn-primary">
                  Create your first project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <ProjectCard2 key={project.id} project={project} />
                ))}
                <Link
                  to="/projects2"
                  className="flex items-center justify-center p-4 border border-dashed border-border rounded-lg hover:bg-background text-text-muted"
                >
                  View all projects
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* News & Updates section */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold mb-4">What’s New</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <div className="flex-shrink-0 text-success">✓</div>
                <span>
                  Create and manage work packages with ease to organize tasks
                  and milestones efficiently.
                </span>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 text-success">✓</div>
                <span>
                  Assign team members to projects for better collaboration and
                  accountability.
                </span>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 text-success">✓</div>
                <span>
                  Visualize project progress and insights through dynamic
                  dashboards and reports.
                </span>
              </li>
              <li className="flex gap-2">
                <div className="flex-shrink-0 text-success">✓</div>
                <span>
                  Track every important change or action with detailed activity
                  logs.
                </span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <Link to="/news" className="text-primary text-sm hover:underline">
                Explore the full release details
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Work Packages section */}
      <div className="mt-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText size={20} />
              <span>Your Work Packages</span>
            </h2>
            <Link to="/work-packages/create" className="btn-primary">
              <Plus size={16} className="mr-1" />
              New Work Package
            </Link>
          </div>

          {workPackages.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted mb-4">
                You don't have any work packages assigned to you yet.
              </p>
              <Link to="/work-packages/create" className="btn-primary">
                Create your first work package
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workPackages.map((workPackage) => (
                <WorkPackageCard
                  key={workPackage.id}
                  workPackage={workPackage}
                  showProject={true}
                />
              ))}
              <Link
                to="/work-packages"
                className="flex items-center justify-center p-4 border border-dashed border-border rounded-lg hover:bg-background text-text-muted"
              >
                View all work packages
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
