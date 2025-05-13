import React, { useState } from "react";
import { Save, X } from "lucide-react";
import { WikiPage } from "../../types";

interface WikiEditorProps {
  initialData: Partial<WikiPage>;
  onSave: (data: Partial<WikiPage>) => void;
  onCancel: () => void;
  isCreating?: boolean;
}

const WikiEditor: React.FC<WikiEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  isCreating = false,
}) => {
  const [formData, setFormData] = useState<Partial<WikiPage>>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.title?.trim()) {
      alert("Title is required");
      return;
    }
    if (!formData.description?.trim()) {
      alert("Content is required");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Enter wiki page title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Content
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          className="w-full p-2 border border-border rounded-md h-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Enter wiki page content (supports HTML)"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          <X size={16} className="mr-2" />
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          <Save size={16} className="mr-2" />
          {isCreating ? "Create" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default WikiEditor;
