import { useState, useRef } from 'react';
import './style.css';

const Searcher = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const activeQueryRef = useRef('');

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    activeQueryRef.current = newQuery;
  };

  const handleSearch = async () => {
    const trimmedQuery = activeQueryRef.current.trim();

    if (!trimmedQuery) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:3800/api/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query: trimmedQuery }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // Extrae títulos desde la sección con musicCardShelfRenderer
      const sectionContents =
        data?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents || [];

      const titles = sectionContents
        .filter(item => item.musicCardShelfRenderer?.title?.runs?.[0]?.text)
        .map(item => item.musicCardShelfRenderer.title.runs[0].text);

      setResults(titles);
    } catch (error) {
      console.error('❌ Error al buscar:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="searcher-container">
      <h2 className="search-title">🔍 Buscar Temas</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Escribe para buscar..."
        value={query}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch} className="search-button">
        Buscar
      </button>

      {loading && <p className="loading">Buscando...</p>}
      {!loading && results.length === 0 && query && (
        <p className="empty">No se encontraron resultados.</p>
      )}

      <ul className="search-results">
        {results.map((title, index) => (
          <li key={index} className="search-item">{title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Searcher;
