import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import workPackageService from "../../services/workPackageService";

// Example color palette
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#845EC2",
  "#D65DB1",
];

interface StatusCount {
  status: string;
  count: number;
}

interface UserWorkCount {
  userName: string;
  count: number;
}

interface WorkPackageTypeStats {
  type: string;
  count: number;
}

interface CategoryCount {
  category: string;
  count: number;
}

interface PriorityStats {
  priority: string;
  count: number;
}

interface WorkPackageDashboardData {
  statusCounts: StatusCount[];
  userWorkCounts: UserWorkCount[];
  workPackageTypeStats: WorkPackageTypeStats[];
  categoryCounts: CategoryCount[];
  priorityStats: PriorityStats[];
}

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [data, setData] = useState<WorkPackageDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!projectId) {
          throw new Error("Project ID is required");
        }

        const response = await workPackageService.getDashboardData(
          Number(projectId)
        );

        if (response.statusCode === "S200" && response.data) {
          setData(response.data.data);
        } else {
          setError(response.message || "Failed to fetch work packages");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [projectId]);

  if (loading) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-center p-10">No dashboard data available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Status Counts - Bar Chart */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-bold mb-2">Work Status Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.statusCounts}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Work Count - Pie Chart */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-bold mb-2">Work Assigned per User</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.userWorkCounts}
              dataKey="count"
              nameKey="userName"
              outerRadius={100}
              label
            >
              {data.userWorkCounts.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Work Package Type Stats - Donut Chart */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-bold mb-2">Work Package Types</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.workPackageTypeStats}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              outerRadius={100}
              label
            >
              {data.workPackageTypeStats.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Count - Horizontal Bar Chart */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-bold mb-2">Work Package Categories</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart layout="vertical" data={data.categoryCounts}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="category" />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Stats - Radar Chart */}
      <div className="bg-white shadow rounded-xl p-4 md:col-span-2">
        <h2 className="text-xl font-bold mb-2">Priority Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius={100} data={data.priorityStats}>
            <PolarGrid />
            <PolarAngleAxis dataKey="priority" />
            <Radar
              name="Count"
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectDashboard;
