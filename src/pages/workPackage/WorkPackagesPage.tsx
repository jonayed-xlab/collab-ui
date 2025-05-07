import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Plus, Search, Filter } from "lucide-react";
import {
  WorkPackage,
  WorkPackageStatus,
  WorkPackagePriority,
} from "../../types";
import workPackageService from "../../services/workPackageService";
import WorkPackageCard from "../../components/work-package/WorkPackageCard";
import Card from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";

const WorkPackagesPage: React.FC = () => {
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>([]);
  const [filteredWorkPackages, setFilteredWorkPackages] = useState<
    WorkPackage[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useAuth();

  useEffect(() => {
    const fetchWorkPackages = async () => {
      try {
        setIsLoading(true);

        if (!state.user?.id) {
          throw new Error("User ID is required");
        }
        const response = await workPackageService.getUserWorkPackages(
          state.user.id
        );
        if (response.statusCode === "S200" && response.data) {
          setWorkPackages(response.data);
          setFilteredWorkPackages(response.data);
        } else {
          setError(response.message || "Failed to fetch work packages");
        }
      } catch (error) {
        setError("An error occurred while fetching work packages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkPackages();
  }, []);

  useEffect(() => {
    let filtered = [...workPackages];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (wp) =>
          wp.title.toLowerCase().includes(query) ||
          wp.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((wp) => wp.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter((wp) => wp.priority === priorityFilter);
    }

    setFilteredWorkPackages(filtered);
  }, [searchQuery, statusFilter, priorityFilter, workPackages]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-64">
          <p className="text-text-muted">Loading work packages...</p>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText size={24} />
          <span>Work Packages</span>
        </h1>
        <Link to="/work-packages/create" className="btn-primary">
          <Plus size={16} className="mr-1" />
          New Work Package
        </Link>
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-text-muted" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
              placeholder="Search work packages by title or description..."
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-text-muted" />
              <span className="text-sm text-text-muted">Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input py-1 px-2 !w-auto"
            >
              <option value="">All Statuses</option>
              {Object.values(WorkPackageStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input py-1 px-2 !w-auto"
            >
              <option value="">All Priorities</option>
              {Object.values(WorkPackagePriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>

            {(searchQuery || statusFilter || priorityFilter) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {filteredWorkPackages.length === 0 ? (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto mb-4 text-text-muted" />
          {workPackages.length === 0 ? (
            <>
              <p className="text-text-muted mb-4">
                No work packages have been created yet.
              </p>
              <Link to="/work-packages/create" className="btn-primary">
                Create your first work package
              </Link>
            </>
          ) : (
            <p className="text-text-muted">
              No work packages found matching your filters.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkPackages.map((workPackage) => (
            <WorkPackageCard
              key={workPackage.id}
              workPackage={workPackage}
              showProject={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkPackagesPage;
