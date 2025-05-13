import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Plus, Search, Clock } from "lucide-react";
import { WikiPage } from "../../types";
import Card from "../../components/ui/Card";
import wikiService from "../../services/wikiService";

const WikiList: React.FC = () => {
  const navigate = useNavigate();
  const [wikiPages, setWikiPages] = useState<WikiPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchWikiPages = async () => {
      try {
        setIsLoading(true);
        const response = await wikiService.getAllWikiPages();

        if (response.statusCode === "S200" && response.data) {
          setWikiPages(response.data);
        } else {
          setError(response.message || "Failed to fetch wiki pages");
        }
      } catch (error) {
        setError("An error occurred while fetching wiki pages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWikiPages();
  }, []);

  const filteredWikiPages = wikiPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWiki = () => {
    navigate("/wiki/create");
  };

  const handleWikiClick = (id: number) => {
    navigate(`/wiki/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-text-muted">Loading wiki pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Book size={24} />
            <span>Wiki</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Knowledge base for your team
          </p>
        </div>

        <button onClick={handleCreateWiki} className="btn-primary">
          <Plus size={16} className="mr-2" />
          Create Wiki Page
        </button>
      </div>

      {error && (
        <div className="bg-error/10 text-error p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search wiki pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
          />
        </div>
      </div>

      {filteredWikiPages.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Book size={48} className="mx-auto mb-4 text-text-muted" />
            <p className="text-lg font-medium mb-2">No wiki pages found</p>
            <p className="text-sm text-text-muted mb-4">
              {searchQuery
                ? "No matching results. Try a different search term."
                : "Create your first wiki page to get started."}
            </p>
            {!searchQuery && (
              <button onClick={handleCreateWiki} className="btn-primary">
                <Plus size={16} className="mr-2" />
                Create Wiki Page
              </button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWikiPages.map((page) => (
            <div
              key={page.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleWikiClick(page.id)}
            >
              <Card>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{page.title}</h3>
                  <div
                    className="text-sm text-text-muted mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        page.description.substring(0, 150) +
                        (page.description.length > 150 ? "..." : ""),
                    }}
                  />
                  <div className="flex items-center text-xs text-text-muted">
                    <Clock size={14} className="mr-1" />
                    <span>
                      Updated {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WikiList;
