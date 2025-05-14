import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import workPackageService from "../../services/workPackageService";

// Color palette that matches the OpenProject style
const COLORS = [
  "#FF8E8E", // Pink for open items (similar to the OpenProject pink)
  "#87CEFA", // Light blue for closed items
  "#FFB347", // Orange
  "#B19CD9", // Purple
  "#77DD77", // Green
  "#FF6961", // Red
];

// Interfaces for our data types
interface StatusCount {
  status: string;
  count: number;
}

interface UserWorkCount {
  username: string;
  count: number;
}

interface WorkPackageTypeStat {
  workPackageType: string;
  openCount: number;
  closeCount: number;
}

interface PriorityStat {
  priority: string;
  openCount: number;
  closeCount: number;
}

interface WorkPackageDashboardData {
  statusCounts: StatusCount[];
  userWorkCounts: UserWorkCount[];
  workPackageTypeStats: WorkPackageTypeStat[];
  priorityStats: PriorityStat[];
}

// Mock service to simulate API call
// const fetchDashboardData = async (projectId) => {
//   // This would normally be a real API call
//   return {
//     statusCode: "S200",
//     message: "success",
//     data: {
//       statusCounts: [
//         { status: "NEW", count: 94 },
//         { status: "SCHEDULED", count: 35 },
//         { status: "IN PROGRESS", count: 12 },
//         { status: "ON HOLD", count: 15 },
//         { status: "DEVELOPED", count: 1 },
//         { status: "PR REVIEW", count: 2 },
//         { status: "REJECTED", count: 207 },
//       ],
//       userWorkCounts: [
//         { username: "John Doe", count: 198 },
//         { username: "Jane Smith", count: 101 },
//         { username: "Ahmed Rashid", count: 128 },
//         { username: "Sourov Sarkar", count: 24 },
//         { username: "Md. Asif Rahman", count: 17 },
//       ],
//       workPackageTypeStats: [
//         { workPackageType: "TASK", openCount: 292, closeCount: 5748 },
//         { workPackageType: "BUG", openCount: 159, closeCount: 2409 },
//         { workPackageType: "USER STORY", openCount: 456, closeCount: 187 },
//         { workPackageType: "EPIC", openCount: 96, closeCount: 10 },
//         { workPackageType: "FEATURE", openCount: 9, closeCount: 39 },
//       ],
//       priorityStats: [
//         { priority: "HIGH", openCount: 92, closeCount: 1230 },
//         { priority: "NORMAL", openCount: 910, closeCount: 6764 },
//         { priority: "LOW", openCount: 7, closeCount: 43 },
//         { priority: "IMMEDIATE", openCount: 2, closeCount: 201 },
//         { priority: "BLOCKER", openCount: 2, closeCount: 186 },
//       ],
//     },
//   };
// };

const ProjectDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [data, setData] = useState<WorkPackageDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const response = await workPackageService.getDashboardData(
          Number(projectId)
        );
        // const response = await fetchDashboardData(projectId);
        if (response.statusCode === "S200") {
          setData(response.data);
        } else {
          setError(response.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [projectId]);

  // Transform work package type data for better visualization
  const getWorkPackageTypeChartData = () => {
    if (!data) return [];
    return data.workPackageTypeStats.map((item) => ({
      name: item.workPackageType,
      open: item.openCount,
      closed: item.closeCount,
    }));
  };

  // Transform priority data for better visualization
  const getPriorityChartData = () => {
    if (!data) return [];
    return data.priorityStats.map((item) => ({
      name: item.priority,
      open: item.openCount,
      closed: item.closeCount,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Project Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Package Status Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">WORK PACKAGES GRAPH</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.statusCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FF8E8E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Work Count Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">WORK GRAPH</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.userWorkCounts} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="username" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FF8E8E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Work Package Type Stats */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">WORK PACKAGES OVERVIEW</h2>
          <p className="text-gray-700 mb-2">Type</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getWorkPackageTypeChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="open" name="open" fill="#FF8E8E" />
              <Bar dataKey="closed" name="closed" fill="#87CEFA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Stats */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">WORK PACKAGES OVERVIEW</h2>
          <p className="text-gray-700 mb-2">Priority</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPriorityChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="open" name="open" fill="#FF8E8E" />
              <Bar dataKey="closed" name="closed" fill="#87CEFA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
