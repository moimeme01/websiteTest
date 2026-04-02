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
        const text = await res.json()

        setDebug(`URL: /streaming/files/\nHTTP: ${res.status}\n\n${text}`)

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = JSON.parse(text)
        setEntries(data)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  console.log('entries =', entries)
  console.log('isArray =', Array.isArray(entries))
  console.log('length =', entries.length)

  return (
    <div style={{ padding: 20 }}>
      <h1>Streaming</h1>
      {loading && <p>Chargement...</p>}
      {error && <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error}</pre>}
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12 }}>
        {debug}
      </pre>
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