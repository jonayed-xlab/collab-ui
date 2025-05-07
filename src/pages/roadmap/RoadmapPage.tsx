import { Plus } from "lucide-react";
import Card from "../../components/ui/Card";
import { Version } from "../../types";
import React, { useEffect, useState } from "react";
import roadmapService from "../../services/RoadmapService";

const RoadmapPage: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await roadmapService.getRoadmap();
        if (response.statusCode === "S200" && response.data) {
          setVersions(response.data);
        } else {
          setError(response.message || "Failed to fetch roadmap");
        }
      } catch (error) {
        setError("An error occurred while fetching roadmap");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVersions();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roadmap</h1>
        {/* <button className="btn-primary flex items-center">
          <Plus size={16} className="mr-2" />
          Version
        </button> */}
      </div>

      {isLoading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          {versions.map((version, index) => (
            <Card key={index}>
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                  {version.sprintName}
                </h2>

                {(version.startDate || version.endDate) && (
                  <p className="text-sm text-text-muted">
                    {version.startDate && <>Start: {version.startDate}</>}{" "}
                    <br />
                    {version.endDate && <>End: {version.endDate}</>}
                  </p>
                )}

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: `${version.progressPercentage}%` }}
                  />
                </div>

                <div className="text-sm mt-1">
                  <span className="text-success font-medium">
                    {version.closedCount} closed
                  </span>{" "}
                  ({version.closedCountPercentage}%)
                  {" • "}
                  <span className="text-primary font-medium">
                    {version.openCount} open
                  </span>{" "}
                  ({version.openCountPercentage}%)
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
