// src/pages/Test.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Test() {
  const [status, setStatus] = useState('checking...')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('documents').select()

      if (error) {
        setStatus('❌ Connection failed')
        setError(error.message)
        console.error(error)
      } else {
        setStatus('✅ Connected successfully')
        setData(data)
      }
    }
    testConnection()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h2>{status}</h2>
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
