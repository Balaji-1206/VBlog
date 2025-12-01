import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import PostCard from '../components/PostCard'
import SkeletonCard from '../components/SkeletonCard'
import { useDebounce } from '../hooks/useDebounce'
import { Input, Button } from '../components/UI'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Home() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('')
  const dq = useDebounce(q, 300)

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['posts', { page, dq, tag }],
    queryFn: async () => {
      const params = new URLSearchParams({ status:'published', page:String(page), limit:'9' })
      if (dq) params.set('q', dq)
      if (tag) params.set('tag', tag)
      const res = await fetch(`${API_BASE}/posts?${params.toString()}`)
      return res.json()
    }
  })

  const tags = useMemo(()=>{
    const set = new Set()
    for(const p of (data?.items||[])){
      (p.tags||[]).forEach(t=> set.add(t))
    }
    return Array.from(set).slice(0,12)
  }, [data])

  if (error) return <div className="card">Error loading posts</div>

  return (
    <div>
      <section className="hero">
        <h1>Discover inspiring stories</h1>
        <p>Fresh posts from the community. Search, filter, and learn.</p>
        <div className="actions bar">
          <div className="search"><Input placeholder="Search posts..." value={q} onChange={(e)=>{setQ(e.target.value); setPage(1)}} /></div>
          {tags.map(t => (
            <button key={t} className={`chip ${tag===t?'active':''}`} onClick={()=>{ setTag(tag===t?'':t); setPage(1) }}>#{t}</button>
          ))}
        </div>
      </section>
      {isLoading ? (
        <div className="grid cols-3">
          {Array.from({length:9}).map((_,i)=> <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid cols-3">
            {data.items.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
          {data.items.length === 0 && (
            <div className="card">No posts found. Try adjusting your search or filters.</div>
          )}
          <div className="pagination">
            <Button disabled={page<=1} onClick={()=> setPage(p=> Math.max(1, p-1))}>Previous</Button>
            <span className="badge muted">Page {data.page} of {data.pages}</span>
            <Button disabled={data.page>=data.pages} onClick={()=> setPage(p=> p+1)}>Next</Button>
            {isFetching && <span className="badge muted">Updating…</span>}
          </div>
        </>
      )}
    </div>
  )
}
