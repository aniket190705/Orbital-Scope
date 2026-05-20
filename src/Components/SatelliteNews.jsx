import { useEffect, useState } from "react";
import fetchSpaceNews from "../utils/fetchSpaceNews";

const SatelliteNews = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNews = async () => {
      try {
        const news = await fetchSpaceNews();
        setArticles(news);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadNews();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#111",
        color: "#fff",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px",
      }}
    >
      {error && (
        <div style={{ gridColumn: "1 / -1", color: "#fca5a5" }}>
          Unable to load space news right now: {error}
        </div>
      )}

      {articles.map((article) => (
        <div
          key={article.id}
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            />
          )}
          <div>
            <h3
              style={{ margin: "0 0 10px", fontSize: "16px", color: "#00bcd4" }}
            >
              {article.title}
            </h3>
            <p style={{ fontSize: "14px", lineHeight: "1.4", color: "#ccc" }}>
              {article.summary?.slice(0, 100)}...
            </p>
          </div>
          <div style={{ marginTop: "12px" }}>
            <p style={{ fontSize: "12px", color: "#888" }}>
              {new Date(article.published_at).toLocaleString()}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "8px",
                display: "inline-block",
                color: "#00bcd4",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Read More →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SatelliteNews;
