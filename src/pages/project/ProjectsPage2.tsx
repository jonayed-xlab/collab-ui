import React, { useEffect, useState } from "react";
import { Briefcase, Search } from "lucide-react";
import { Project } from "../../types";
import projectService from "../../services/projectService";
import Card from "../../components/ui/Card";
import ProjectCard2 from "../../components/project/ProjectCard2";

const ProjectsPage2: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await projectService.getAllProjects();

        if (response.statusCode === "S200" && response.data) {
          setProjects(response.data);
          setFilteredProjects(response.data);
        } else {
          setError(response.message || "Failed to fetch projects");
        }
      } catch (error) {
        setError("An error occurred while fetching projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-64">
          <p className="text-text-muted">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto">
        <div className="bg-error/10 text-error p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Card className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-text-muted" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
            placeholder="Search projects by name or description..."
          />
        </div>
      </Card>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase size={48} className="mx-auto mb-4 text-text-muted" />
          {projects.length === 0 ? (
            <>
              <p className="text-text-muted mb-4">
                No projects have been created yet.
              </p>
            </>
          ) : (
            <p className="text-text-muted">
              No projects found matching your search.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard2 key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage2;
