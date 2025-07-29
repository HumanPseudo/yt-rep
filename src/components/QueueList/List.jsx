import { useEffect, useState } from 'react';
import './style.css';

const QueueFetcher = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueueLoop = async () => {
    try {
    //   console.log('⏱️ Fetching /queue...');
      const response = await fetch('http://localhost:3800/api/v1/queue', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    //   console.log('🎧 Data from /queue:', data);

      setItems(data.items || []);
      setLoading(false);
    } catch (error) {
      console.error('❌ Fetch error:', error);
    } finally {
      // Esperar 2 segundos antes de la siguiente llamada (ajustable)
      setTimeout(fetchQueueLoop, 2000);
    }
  };

  useEffect(() => {
    fetchQueueLoop(); // iniciar bucle de polling

    // Cleanup opcional si quisieras abortar (no necesario en este caso)
    return () => {
      // podrías cancelar con AbortController si es necesario
    };
  }, []);

  return (
    <div className="queue-container">
      <h2 className="queue-title">🎧 Cola de Reproducción</h2>
      {loading && <p className="loading">Cargando...</p>}
      {!loading && items.length === 0 && <p className="empty">No hay elementos en la cola.</p>}
      <ul className="queue-list">
        {items.map((item, index) => {
          const renderer = item.playlistPanelVideoRenderer;
          const title = renderer?.title?.runs?.[0]?.text || 'Sin título';
          const videoId = renderer?.videoId;

          return (
            <li key={index} className="queue-item">
              🎵 <span className="video-title">{title}</span>{' '}
              {videoId && (
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-link"
                >
                  Ver
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default QueueFetcher;
