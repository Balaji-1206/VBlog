import { Link } from 'react-router-dom'

export default function PostCard({ post }){
  return (
    <div className="card">
      {post.coverImageUrl && (
        <div style={{margin:-16, marginBottom:12}}>
          <img src={post.coverImageUrl} alt="cover" style={{width:'100%', height:160, objectFit:'cover', borderTopLeftRadius:12, borderTopRightRadius:12}} />
        </div>
      )}
      {post.videoUrl && (
        <div style={{marginBottom:12}}>
          <video src={post.videoUrl} controls style={{width:'100%', borderRadius:12}} />
        </div>
      )}
      <div className="meta">By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}</div>
      <Link className="title" to={`/post/${post.slug}`}>{post.title}</Link>
      <p className="excerpt">{post.excerpt}</p>
      <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
        {(post.tags||[]).map(t => <span key={t} className="badge">#{t}</span>)}
      </div>
    </div>
  )}
