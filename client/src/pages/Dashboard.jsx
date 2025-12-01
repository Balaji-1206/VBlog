import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { Button } from '../components/UI'

export default function Dashboard() {
  const auth = useAuth()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['mine'],
    queryFn: async () => {
      const client = api(auth)
      const { data } = await client.get('/posts/dashboard/mine')
      return data
    }
  })

  const del = useMutation({
    mutationFn: async (id) => {
      const client = api(auth)
      await client.delete(`/posts/${id}`)
    },
    onSuccess: ()=> qc.invalidateQueries({ queryKey: ['mine'] })
  })

  const toggleStatus = useMutation({
    mutationFn: async ({ id, next }) => {
      const client = api(auth)
      const { data } = await client.put(`/posts/${id}`, { status: next })
      return data
    },
    onSuccess: ()=> qc.invalidateQueries({ queryKey: ['mine'] })
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 className="page-title">My Posts</h2>
        <Link to="/editor"><Button variant="primary">New Post</Button></Link>
      </div>
      <div className="actions bar">
        <span className="badge">Total: {data?.length||0}</span>
        <span className="badge success">Published: {data?.filter(p=>p.status==='published').length||0}</span>
        <span className="badge warning">Drafts: {data?.filter(p=>p.status==='draft').length||0}</span>
      </div>
      <div className="grid">
        {data?.length ? data.map((p)=> (
          <div key={p._id} className="card">
            <div className="meta">Updated {new Date(p.updatedAt).toLocaleString()}</div>
            <Link className="title" to={`/post/${p.slug}`}>{p.title}</Link>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <span className={`badge ${p.status==='published'?'success':'warning'}`}>{p.status}</span>
              <Button variant={p.status==='published'?'warning':'success'} iconLeft={<span>⇵</span>} onClick={()=> toggleStatus.mutate({ id: p._id, next: p.status==='published'?'draft':'published' })}>
                {toggleStatus.isPending ? 'Updating…' : (p.status==='published' ? 'Unpublish' : 'Publish')}
              </Button>
              <Link className="button soft" to={`/editor?id=${p._id}`}>Edit</Link>
              <Button variant="danger" iconLeft={<span>✖</span>} onClick={()=>{
                if (confirm('Delete this post?')) del.mutate(p._id)
              }} style={{borderColor:'#532023', background:'linear-gradient(180deg,#2a0f11,#1a0a0b)', color:'#ffb3b8'}}>Delete</Button>
            </div>
          </div>
        )) : <div className="card">No posts yet. Click “New Post” to create one.</div>}
      </div>
    </div>
  )
}
