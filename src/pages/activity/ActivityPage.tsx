import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import activityService from "../../services/activityService";
import ActivityItem from "../../components/activity/ActivityItem";
import Card from "../../components/ui/Card";
import { FieldChangeLog } from "../../types";

const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<FieldChangeLog[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async (pageNumber = 0) => {
    setIsLoading(true);
    try {
      const res = await activityService.getActivityLogsPaginated(pageNumber); // make sure service supports pagination
      if (res.statusCode === "S200" && res.data) {
        setActivities(res.data.content);
        setTotalPages(res.data.totalPages);
        setPage(res.data.number);
      } else {
        throw new Error(res.message || "Failed to fetch activity logs");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchActivities(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6 flex items-center gap-3">
        <FileText className="text-primary" />
        <h1 className="text-2xl font-bold">Activity Logs</h1>
      </header>

      {isLoading ? (
        <div className="text-center py-24 text-muted">
          Loading activities...
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Changes</h2>
          </div>

          {activities.length === 0 ? (
            <div className="py-12 text-center text-muted">
              No activity logs available.
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}

              {/* Pagination controls */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                  className="px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ActivityPage;
