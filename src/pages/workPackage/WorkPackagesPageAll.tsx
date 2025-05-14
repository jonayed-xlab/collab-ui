import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Search, List, Grid } from "lucide-react";
import {
  WorkPackageStatus,
  WorkPackageResponse,
  WorkPackageType,
} from "../../types";
import workPackageService from "../../services/workPackageService";
import Card from "../../components/ui/Card";

const WorkPackagesPageAll: React.FC = () => {
  const navigate = useNavigate();
  const [workPackages, setWorkPackages] = useState<WorkPackageResponse[]>([]);
  const [filteredWorkPackages, setFilteredWorkPackages] = useState<
    WorkPackageResponse[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen((prev) => !prev);
  };

  const toggleTypeDropdown = () => {
    setIsTypeDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchWorkPackages = async () => {
      setLoading(true);
      try {
        const response = await workPackageService.getProjectWorkPackagesAll();
        if (response.statusCode === "S200" && response.data) {
          setWorkPackages(response.data);
          setFilteredWorkPackages(response.data);
        } else {
          setError("Failed to load work packages");
        }
      } catch (err) {
        setError("An error occurred while fetching work packages");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkPackages();
  }, []);

  useEffect(() => {
    let result = [...workPackages];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (wp) =>
          wp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (wp.description &&
            wp.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((wp) => wp.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((wp) => wp.workPackageType === typeFilter);
    }

    setFilteredWorkPackages(result);
  }, [searchQuery, statusFilter, typeFilter, workPackages]);

  const handleCreateWorkPackage = () => {
    navigate("/work-packages/create");
  };

  const getStatusLabel = (status: WorkPackageStatus) => {
    switch (status) {
      case WorkPackageStatus.NEW:
        return "New";
      case WorkPackageStatus.IN_PROGRESS:
        return "In progress";
      case WorkPackageStatus.COMPLETED:
        return "Completed";
      case WorkPackageStatus.ON_HOLD:
        return "On hold";
      case WorkPackageStatus.CLOSED:
        return "Closed";
      default:
        return status;
    }
  };

  const getStatusClass = (status: WorkPackageStatus) => {
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

  const getTypeLabel = (type: WorkPackageType) => {
    switch (type) {
      case WorkPackageType.TASK:
        return "Task";
      case WorkPackageType.BUG:
        return "Bug";
      case WorkPackageType.FEATURE:
        return "Feature";
      case WorkPackageType.EPIC:
        return "Epic";
      case WorkPackageType.STORY:
        return "User Story";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText size={24} />
            <span>All Work Packages</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title..."
              className="input pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted"
            />
          </div>

          <div className="flex items-center">
            <button
              className={`p-2 rounded-l-md border border-r-0 ${
                viewMode === "list" ? "bg-primary text-white" : "bg-white"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
            <button
              className={`p-2 rounded-r-md border ${
                viewMode === "grid" ? "bg-primary text-white" : "bg-white"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
          </div>

          <button
            onClick={handleCreateWorkPackage}
            className="btn-primary flex items-center gap-1"
          >
            <Plus size={16} />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative inline-block">
          <button className="btn-secondary flex items-center gap-1">
            <span>Status</span>
            <ChevronDown size={16} />
          </button>
          <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-background"
              onClick={() => setStatusFilter(null)}
            >
              All
            </button>
            {Object.values(WorkPackageStatus).map((status) => (
              <button
                key={status}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-background"
                onClick={() => setStatusFilter(status)}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        <div className="relative inline-block">
          <button className="btn-secondary flex items-center gap-1">
            <span>Type</span>
            <ChevronDown size={16} />
          </button>
          <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-background"
              onClick={() => setTypeFilter(null)}
            >
              All
            </button>
            {Object.values(WorkPackageType).map((type) => (
              <button
                key={type}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-background"
                onClick={() => setTypeFilter(type)}
              >
                {getTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {loading ? (
        <Card>
          <div className="p-4 text-center">
            <p className="text-text-muted">Loading work packages...</p>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="p-4 text-center">
            <p className="text-error">{error}</p>
          </div>
        </Card>
      ) : filteredWorkPackages.length === 0 ? (
        <Card>
          <div className="p-4 text-center">
            <FileText size={48} className="mx-auto mb-4 text-text-muted" />
            <p className="text-lg font-medium mb-2">No work packages found</p>
            <p className="text-sm text-text-muted mb-4">
              {searchQuery
                ? "No matching results. Try a different search term."
                : "Create your first work package to get started."}
            </p>
            {!searchQuery && (
              <button onClick={handleCreateWorkPackage} className="btn-primary">
                <Plus size={16} className="mr-2" />
                Create Work Package
              </button>
            )}
          </div>
        </Card>
      ) : viewMode === "list" ? (
        <div className="bg-white border border-border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredWorkPackages.map((wp) => (
                <tr
                  key={wp.id}
                  className="hover:bg-background cursor-pointer"
                  onClick={() => navigate(`/work-packages/${wp.id}`)}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text">
                    #{wp.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-primary">{wp.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text">
                    {getTypeLabel(wp.workPackageType)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                        wp.status
                      )}`}
                    >
                      {getStatusLabel(wp.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text">
                    {wp.projectName || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text">
                    {wp.assignedToName || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkPackages.map((wp) => (
            <div
              key={wp.id}
              className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/work-packages/${wp.id}`)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                      wp.status
                    )}`}
                  >
                    {getStatusLabel(wp.status)}
                  </span>
                  <span className="text-xs text-text-muted">#{wp.id}</span>
                </div>
                <h3 className="text-lg font-medium text-primary mb-2">
                  {wp.title}
                </h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-2">
                  {wp.description || "No description"}
                </p>
                <div className="flex justify-between items-center text-xs text-text-muted">
                  <span>{getTypeLabel(wp.workPackageType)}</span>
                  <span>{wp.projectName || "No project"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkPackagesPageAll;
