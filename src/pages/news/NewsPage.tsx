// pages/NewsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
};

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const API_KEY = "c4169e8bba90287cfe4fd81382869275_";
  const NEWS_API_URL = `https://gnews.io/api/v4/top-headlines?lang=en&token=${API_KEY}&max=${pageSize}&page=${page}`;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(NEWS_API_URL);
        setArticles(response.data.articles || []);
      } catch (err) {
        setError("Failed to load news articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Latest News</h1>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : error ? (
        <div className="text-error bg-error/10 p-4 rounded-md">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition"
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {article.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {article.source.name} &middot;{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <button onClick={handleNextPage} className="btn-secondary">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsPage;
