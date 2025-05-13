import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FileText,
  Calendar,
  User,
  Clock,
  Edit,
  Trash2,
  ChevronLeft,
  Link as LinkIcon,
  MessageSquare,
  CheckSquare,
  ChevronRight,
  GitBranch,
  GitPullRequest,
  Layers,
  ListTree,
} from "lucide-react";
import {
  WorkPackageResponseWrapper,
  WorkPackageStatus,
  WorkPackageType,
  WorkPackage,
  WorkPackagePriority,
} from "../../types";
import workPackageService from "../../services/workPackageService";
import Card from "../../components/ui/Card";
import WorkPackageCard from "../../components/work-package/WorkPackageCard";
import { useAuth } from "../../contexts/AuthContext";
import Breadcrumb from "../../components/ui/Breadcrumb";

const WorkPackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [workPackageData, setWorkPackageData] =
    useState<WorkPackageResponseWrapper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity" | "relations"
  >("overview");
  const [parentWorkPackage, setParentWorkPackage] =
    useState<WorkPackage | null>(null);

  useEffect(() => {
    const fetchWorkPackage = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await workPackageService.getWorkPackageById(
          Number(id)
        );
        if (response.statusCode === "S200" && response.data) {
          setWorkPackageData(response.data);

          if (response.data.workPackage.parentId) {
            const parentResponse = await workPackageService.getWorkPackageById(
              response.data.workPackage.parentId
            );
            if (parentResponse.statusCode === "S200" && parentResponse.data) {
              setParentWorkPackage(parentResponse.data.workPackage);
            }
          }
        } else {
          setError("Failed to load work package details");
        }
      } catch (err) {
        setError("An error occurred while fetching work package details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkPackage();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/work-packages/${id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this work package?")
    ) {
      return;
    }

    try {
      const response = await workPackageService.deleteWorkPackage(Number(id));
      if (response.statusCode === "S200") {
        navigate("/work-packages");
      } else {
        setError("Failed to delete work package");
      }
    } catch (err) {
      setError("An error occurred while deleting the work package");
    }
  };

  const handleCreateChild = () => {
    if (id && workPackageData?.workPackage.projectId) {
      navigate(
        `/projects/${workPackageData.workPackage.projectId}/${workPackageData.workPackage.id}/${workPackageData.workPackage.workPackageType}/work-packages/create`,
        {
          state: { parentId: id },
        }
      );
    }
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
        return "bg-blue-100 text-blue-800";
      case WorkPackageStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800";
      case WorkPackageStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case WorkPackageStatus.ON_HOLD:
        return "bg-gray-100 text-gray-800";
      case WorkPackageStatus.CLOSED:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
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

  const getPriorityLabel = (priority: WorkPackagePriority) => {
    switch (priority) {
      case WorkPackagePriority.LOW:
        return "Low";
      case WorkPackagePriority.MEDIUM:
        return "Medium";
      case WorkPackagePriority.HIGH:
        return "High";
      case WorkPackagePriority.URGENT:
        return "Urgent";
      default:
        return priority;
    }
  };

  const getPriorityClass = (priority: WorkPackagePriority) => {
    switch (priority) {
      case WorkPackagePriority.LOW:
        return "bg-green-100 text-green-800";
      case WorkPackagePriority.MEDIUM:
        return "bg-yellow-100 text-yellow-800";
      case WorkPackagePriority.HIGH:
        return "bg-orange-100 text-orange-800";
      case WorkPackagePriority.URGENT:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: WorkPackageType) => {
    switch (type) {
      case WorkPackageType.EPIC:
        return <Layers size={16} className="mr-1" />;
      case WorkPackageType.STORY:
        return <ListTree size={16} className="mr-1" />;
      case WorkPackageType.FEATURE:
        return <GitPullRequest size={16} className="mr-1" />;
      case WorkPackageType.BUG:
        return <GitBranch size={16} className="mr-1" />;
      default:
        return <FileText size={16} className="mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <div className="p-4 text-center">
            <p className="text-gray-500">Loading work package details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => navigate("/work-packages/all")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Work Packages
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!workPackageData || !workPackageData.workPackage) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <div className="p-4 text-center">
            <p className="text-gray-500">Work package not found</p>
            <button
              onClick={() => navigate("/work-packages")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Work Packages
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const { workPackage, relatedWorkPackages, childWorkPackages } =
    workPackageData;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Work Packages", path: "/work-packages" },
            {
              label: workPackage.title,
              path: `/work-packages/${workPackage.id}`,
            },
          ]}
        />
      </div>

      {/* Parent work package link if exists */}
      {parentWorkPackage && (
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <Link
            to={`/work-packages/${parentWorkPackage.id}`}
            className="flex items-center hover:text-blue-600"
          >
            <ChevronRight className="transform rotate-180 mr-1" size={16} />
            Parent: {parentWorkPackage.title}
          </Link>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {getTypeIcon(workPackage.workPackageType)}
              {workPackage.title}
            </h1>
            <div className="flex items-center mt-2 space-x-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                  workPackage.status
                )}`}
              >
                {getStatusLabel(workPackage.status)}
              </span>
              <span className="text-sm text-gray-600">#{workPackage.id}</span>
            </div>
          </div>

          {
            // change state.user?.id === workPackage.id &&
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-red-700"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          }
        </div>

        {/* <div className="mb-6">
          <p className="text-gray-700">{workPackage.description}</p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-xs font-semibold text-gray-500 mb-1">Type</h3>
            <p>{getTypeLabel(workPackage.workPackageType)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-xs font-semibold text-gray-500 mb-1">
              Project
            </h3>
            <p>{workPackage.projectName || "No project"}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-xs font-semibold text-gray-500 mb-1">
              Assigned To
            </h3>
            <p>{workPackage.assignedToName || "Unassigned"}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-xs font-semibold text-gray-500 mb-1">
              Created At
            </h3>
            <p>
              {workPackage.createdAt
                ? new Date(workPackage.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleCreateChild}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700"
          >
            <GitBranch size={16} />
            <span>Create Child</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "activity"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab("relations")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "relations"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Relations
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "overview" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Description Section */}
              <div className="text-lg font-semibold mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {workPackage.description || "No description provided"}
                </p>
              </div>

              <h3 className="mt-6 pt-4 border-t border-gray-200">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Priority */}
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Priority
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(
                      workPackage.priority
                    )}`}
                  >
                    {getPriorityLabel(workPackage.priority)}
                  </span>
                </div>

                {/* Time Tracking */}
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Estimated Work
                  </h3>
                  <p>{workPackage.estimateWork || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Remaining Work
                  </h3>
                  <p>{workPackage.remainingWork || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Spent Work
                  </h3>
                  <p>{workPackage.spentWork || "N/A"}</p>
                </div>

                {/* Dates */}
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Start Date
                  </h3>
                  <p>
                    {workPackage.startDate
                      ? new Date(workPackage.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    End Date
                  </h3>
                  <p>
                    {workPackage.endDate
                      ? new Date(workPackage.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Audit Info */}
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Created By
                  </h3>
                  <p>{workPackage.createdByName || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Created At
                  </h3>
                  <p>
                    {workPackage.createdAt
                      ? new Date(workPackage.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Last Updated
                  </h3>
                  <p>
                    {workPackage.updatedAt
                      ? new Date(workPackage.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Accountability */}
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-gray-500 mb-1">
                    Accountable To
                  </h3>
                  <p>{workPackage.accountableToName || "N/A"}</p>
                </div>
              </div>

              {/* Description Section */}
              {/* <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {workPackage.description || "No description provided"}
                </p>
              </div> */}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <MessageSquare size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Comment added</p>
                    <p className="text-sm text-gray-500">
                      2 days ago by {workPackage.createdByName}
                    </p>
                    <p className="mt-1 text-gray-700">
                      This is a sample comment on the work package.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <CheckSquare size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Status changed</p>
                    <p className="text-sm text-gray-500">
                      3 days ago by {workPackage.createdByName}
                    </p>
                    <p className="mt-1 text-gray-700">
                      Changed status from{" "}
                      <span className="font-medium">New</span> to{" "}
                      <span className="font-medium">In Progress</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "relations" && (
            <div className="space-y-6">
              {childWorkPackages && childWorkPackages.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <GitBranch size={18} className="mr-2" />
                    Child Work Packages ({childWorkPackages.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {childWorkPackages.map((childWp) => (
                      <WorkPackageCard
                        key={childWp.id}
                        workPackage={childWp}
                        showProject={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {relatedWorkPackages && relatedWorkPackages.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <LinkIcon size={18} className="mr-2" />
                    Related Work Packages ({relatedWorkPackages.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedWorkPackages.map((relatedWp) => (
                      <WorkPackageCard
                        key={relatedWp.id}
                        workPackage={relatedWp}
                        showProject={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {childWorkPackages?.length === 0 &&
                relatedWorkPackages?.length === 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">
                      No relations found for this work package.
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkPackageDetailPage;
