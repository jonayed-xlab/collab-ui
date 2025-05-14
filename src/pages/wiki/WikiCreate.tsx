import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, X } from "lucide-react";
import { WikiPage } from "../../types";
import Card from "../../components/ui/Card";
import WikiEditor from "../../components/wiki/WikiEditor";
import wikiService from "../../services/wikiService";

const WikiCreate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create empty wiki page template
  const emptyWikiPage: Partial<WikiPage> = {
    title: "",
    description: "",
  };

  const handleSave = async (wikiData: Partial<WikiPage>) => {
    try {
      setIsLoading(true);
      const response = await wikiService.createWikiPage({
        ...wikiData,
        id: wikiData.id ?? null,
        description: wikiData.description || null,
      } as WikiPage);

      if (response.statusCode === "S200" && response.data) {
        navigate(`/wiki/${response.data.id}`);
      } else {
        setError(response.message || "Failed to create wiki page");
      }
    } catch (error) {
      setError("An error occurred while creating the wiki page");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the wiki list
    navigate("/wikis");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-text-muted">Creating wiki page...</p>
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
            <span>Create New Wiki Page</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Create a new knowledge base article
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleCancel} className="btn-secondary">
            <X size={16} className="mr-2" />
            Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 text-error p-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}

      <Card>
        <WikiEditor
          initialData={emptyWikiPage}
          onSave={handleSave}
          onCancel={handleCancel}
          isCreating={true}
        />
      </Card>
    </div>
  );
};

export default WikiCreate;
