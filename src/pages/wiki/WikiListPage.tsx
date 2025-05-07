import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, Plus, Search, FolderTree } from "lucide-react";
import { WikiPage } from "../../types";
import wikiService from "../../services/wikiService";
import Card from "../../components/ui/Card";

const WikiListPage: React.FC = () => {
  const navigate = useNavigate();
  const [wikiPages, setWikiPages] = useState<WikiPage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWikiPages = async () => {
      try {
        setIsLoading(true);
        const response = await wikiService.getAllWikiPages(1); // Replace with actual project ID

        if (response.statusCode === "S200" && response.data) {
          //   setWikiPages(response.data);
        } else {
          //   setError(response.message || "Failed to fetch wiki pages");
        }
      } catch (error) {
        setError("An error occurred while fetching wiki pages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWikiPages();
  }, []);

  const filteredPages = wikiPages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-text-muted">Loading wiki pages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-error/10 text-error p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Book size={24} />
          <span>Wiki</span>
        </h1>
        <Link to="/wiki/create" className="btn-primary">
          <Plus size={16} className="mr-2" />
          New Page
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <FolderTree size={18} />
              <span>Page Tree</span>
            </h2>

            <div className="text-sm text-text-muted">
              Page tree feature coming soon...
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
                placeholder="Search wiki pages..."
              />
            </div>
          </Card>

          {filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <Book size={48} className="mx-auto mb-4 text-text-muted" />
              {wikiPages.length === 0 ? (
                <>
                  <p className="text-lg text-text-muted mb-4">
                    No wiki pages have been created yet.
                  </p>
                  <Link to="/wiki/create" className="btn-primary">
                    Create your first page
                  </Link>
                </>
              ) : (
                <p className="text-lg text-text-muted">
                  No pages found matching your search.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPages.map((page) => (
                <Card
                  key={page.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <Link to={`/wiki/${page.id}`} className="block">
                    <h3 className="text-lg font-medium text-primary hover:underline mb-2">
                      {page.title}
                    </h3>
                    <p className="text-sm text-text-muted mb-4">
                      {page.content.substring(0, 200)}...
                    </p>
                    <div className="text-xs text-text-muted">
                      Last updated{" "}
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WikiListPage;
