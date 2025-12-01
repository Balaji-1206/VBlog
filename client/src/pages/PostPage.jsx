import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { marked } from 'marked'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function PostPage() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/posts/${slug}`)
      return res.json()
    }
  })

  if (isLoading) return <p>Loading...</p>
  if (!data?._id) return <p>Not found</p>

  return (
    <article className="card">
      <h1 className="page-title">{data.title}</h1>
      <div className="meta">By {data.author?.name} • {new Date(data.createdAt).toLocaleDateString()}</div>
      <hr className="line" />
      <div dangerouslySetInnerHTML={{ __html: marked.parse(data.content) }} />
    </article>
  )
}
