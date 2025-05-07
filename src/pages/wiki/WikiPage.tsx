import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Book, Edit, Trash2, Clock, Plus } from "lucide-react";
import { WikiPage as WikiPageType } from "../../types";
import Card from "../../components/ui/Card";
import WikiEditor from "../../components/wiki/WikiEditor";
import wikiService from "../../services/wikiService"; // Adjust the path as needed

const WikiPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wikiPage, setWikiPage] = useState<WikiPageType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWikiPage = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await wikiService.getWikiPageById(parseInt(id));

        if (response. && response.data) {
          setWikiPage(response.data);
        } else {
          setError(response.error || "Failed to fetch wiki page");
        }
      } catch (error) {
        setError("An error occurred while fetching the wiki page");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWikiPage();
  }, [id]);

  const handleDelete = async () => {
    if (!wikiPage || !confirm("Are you sure you want to delete this page?"))
      return;

    try {
      const response = await wikiService.deleteWikiPage(wikiPage.id);

      if (response.success) {
        navigate("/wiki");
      } else {
        setError(response.error || "Failed to delete wiki page");
      }
    } catch (error) {
      setError("An error occurred while deleting the wiki page");
    }
  };

  const handleSave = async (updatedData: Partial<WikiPageType>) => {
    if (!wikiPage) return;

    try {
      const response = await wikiService.updateWikiPage(
        wikiPage.id,
        updatedData
      );

      if (response.success && response.data) {
        setWikiPage(response.data);
        setIsEditing(false);
      } else {
        setError(response.error || "Failed to update wiki page");
      }
    } catch (error) {
      setError("An error occurred while updating the wiki page");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-text-muted">Loading wiki page...</p>
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

  if (!wikiPage) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Book size={48} className="mx-auto mb-4 text-text-muted" />
          <p className="text-lg text-text-muted mb-4">Wiki page not found</p>
          <button onClick={() => navigate("/wiki")} className="btn-primary">
            Back to Wiki
          </button>
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
            <span>{wikiPage.title}</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Last updated {new Date(wikiPage.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </button>
          <button onClick={handleDelete} className="btn-secondary text-error">
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <WikiEditor
          initialData={wikiPage}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Card>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: wikiPage.content }}
          />
        </Card>
      )}

      {/* History section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} />
          <span>Page History</span>
        </h2>

        <Card>
          <div className="text-sm text-text-muted">
            History feature coming soon...
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WikiPage;
