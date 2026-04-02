import { useEffect, useState } from 'react'

export default function StreamingBrowser() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [debug, setDebug] = useState('')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        setDebug('')

        const res = await fetch('http://thibaultvanni.ovh/streaming/files/')

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        console.log('data =', data)

        setDebug(
          `URL: /streaming/files/\nHTTP: ${res.status}\n\n${JSON.stringify(data, null, 2)}`
        )

        setEntries(data)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    console.log('entries mis à jour =', entries)
  }, [entries])

  return (
    <div style={{ padding: 20 }}>
      <h1>Streaming</h1>

      {loading && <p>Chargement...</p>}
      {error && (
        <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
          {error}
        </pre>
      )}

      <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12 }}>
        {debug}
      </pre>

      <p>Nombre: {entries.length}</p>

      <ul>
        {entries.map((entry) => (
          <li key={entry.name}>
            {entry.type} - {entry.name}
          </li>
        ))}
      </ul>
    </div>
  )
}