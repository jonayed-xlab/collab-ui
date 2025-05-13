import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Plus, Search, Filter } from "lucide-react";
import { WorkPackage, WorkPackageType } from "../../types";
import workPackageService from "../../services/workPackageService";
import Card from "../../components/ui/Card";

const WorkPackagesPage: React.FC = () => {
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    const fetchWorkPackages = async () => {
      try {
        setIsLoading(true);
        const response = await workPackageService.getAllWorkPackages();
        if (response.statusCode === "S200" && response.data) {
          setWorkPackages(response.data);
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

  const filteredWorkPackages = workPackages.filter((wp) => {
    const matchesSearch =
      wp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || wp.workPackageType === selectedType;
    return matchesSearch && matchesType;
  });

  const formatTime = (hours: number) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
    return `${hours}h`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-text-muted">Loading work packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock size={24} />
          Work Packages
        </h1>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
          <Link
            to="/work-packages/create"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Create
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                size={20}
              />
              <input
                type="text"
                className="input pl-10"
                placeholder="Search work packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <select
            className="input w-48"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="EPIC">Epic</option>
            <option value="USER_STORY">User Story</option>
            <option value="TASK">Task</option>
            <option value="BUG">Bug</option>
          </select>
        </div>
      </Card>

      <div className="bg-white rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4">WBS</th>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Subject</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Finish Date</th>
              <th className="text-left p-4">Work</th>
              <th className="text-left p-4">Spent Time</th>
              <th className="text-left p-4">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkPackages.map((wp) => (
              <tr
                key={wp.id}
                className="border-b border-border hover:bg-background"
              >
                {/* <td className="p-4">{wp.wbs}</td> */}
                <td className="p-4">{wp.id}</td>
                <td className="p-4">
                  <Link
                    to={`/work-packages/${wp.id}`}
                    className="text-primary hover:underline"
                  >
                    {wp.title}
                  </Link>
                </td>
                <td className="p-4">{wp.workPackageType}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      wp.status === "IN_PROGRESS"
                        ? "bg-warning/10 text-warning"
                        : wp.status === "COMPLETED"
                        ? "bg-success/10 text-success"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {wp.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4">
                  {wp.endDate ? new Date(wp.endDate).toLocaleDateString() : "-"}
                </td>
                <td className="p-4">{wp.estimateWork || "-"}</td>
                <td className="p-4">
                  {wp.spentWork ? formatTime(parseFloat(wp.spentWork)) : "-"}
                </td>
                <td className="p-4">
                  {wp.assignedTo && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                        {wp.assignedTo.toString().substring(0, 2)}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkPackagesPage;
