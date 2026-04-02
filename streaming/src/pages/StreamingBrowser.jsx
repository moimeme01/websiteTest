import { useEffect, useState } from 'react'
import './StreamingBrowser.css'

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)$/i
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i

function formatSize(size) {
  if (size == null) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let i = 0

  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }

  return `${value.toFixed(1)} ${units[i]}`
}

export default function StreamingBrowser() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')

        const res = await fetch('http://thibaultvanni.ovh/streaming/files/')

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        setEntries(data)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="streaming-page">
      <header className="streaming-header">
        <h1>Streaming</h1>
        <p>{entries.length} fichier(s)</p>
      </header>

      {loading && <p>Chargement...</p>}
      {error && <pre className="error-box">{error}</pre>}

      {!loading && !error && (
        <div className="media-grid">
          {entries.map((entry) => {
            const url = `http://thibaultvanni.ovh/streaming/files/${encodeURIComponent(entry.name)}`
            const isVideo = VIDEO_EXT.test(entry.name)
            const isImage = IMAGE_EXT.test(entry.name)

            return (
              <article key={entry.name} className="media-card">
                <div className="media-preview">
                  {isImage ? (
                    <img src={url} alt={entry.name} />
                  ) : isVideo ? (
                    <video controls preload="metadata">
                      <source src={url} type="video/quicktime" />
                      Ton navigateur ne supporte pas cette vidéo.
                    </video>
                  ) : (
                    <div className="file-fallback">Aperçu non disponible</div>
                  )}
                </div>

                <div className="media-body">
                  <h2 className="media-title">{entry.name}</h2>
                  <p className="media-meta">
                    {entry.type} • {formatSize(entry.size)}
                  </p>
                  <p className="media-date">
                    {new Date(entry.mtime).toLocaleString()}
                  </p>
                  <a
                    className="media-link"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ouvrir le fichier
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}