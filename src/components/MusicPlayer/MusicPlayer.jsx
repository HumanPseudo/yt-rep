import React, { useState, useEffect, useRef } from 'react';
import './style.css';

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

const MusicPlayer = () => {
  const [song, setSong] = useState({
    title: 'Cargando...',
    artist: '',
    album: '',
    imageSrc: '',
    elapsedSeconds: 0,
    songDuration: 0,
    isPaused: true,
  });

  const refreshRef = useRef(null);

  const fetchCurrentSong = async () => {
    try {
      const response = await fetch('http://localhost:3800/api/v1/song');
      const data = await response.json();
      setSong(data);
    } catch (err) {
      console.error('Error al obtener la canción:', err);
      setSong(prev => ({ ...prev, title: 'Error al cargar' }));
    }
  };

  useEffect(() => {
    fetchCurrentSong(); // Fetch inicial
    refreshRef.current = setInterval(fetchCurrentSong, 1000); // Sincroniza cada segundo

    return () => clearInterval(refreshRef.current);
  }, []);

  const progressPercent = song.songDuration
    ? (song.elapsedSeconds / song.songDuration) * 100
    : 0;

  return (
    <div className="player">
      <div className="album-art">
        {song.imageSrc ? (
          <img
            src={song.imageSrc}
            alt="Portada"
            style={{ width: '100%', height: '100%', borderRadius: '8px' }}
          />
        ) : (
          'Álbum Art'
        )}
      </div>

      <div className="song-info">
        <h2 className="song-title">{song.title || 'Sin título'}</h2>
        <p className="song-artist">{song.artist}</p>
        <p className="song-album">{song.album}</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="time-display">
          <span>{formatTime(song.elapsedSeconds || 0)}</span>
          <span>{formatTime(song.songDuration || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
