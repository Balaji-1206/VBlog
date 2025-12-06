import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { marked } from 'marked'
import { Button, Field, Input, Textarea, Select } from '../components/UI'
import { useSearchParams } from 'react-router-dom'

export default function Editor() {
  const auth = useAuth()
  const [params] = useSearchParams()
  const postId = useMemo(()=> params.get('id') || null, [params])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft')
  const [message, setMessage] = useState('')

  useEffect(()=>{
    async function load(){
      if (!postId) return
      try{
        const client = api(auth)
        const { data } = await client.get('/posts/dashboard/mine')
        const found = data.find(x => x._id === postId)
        if (found){
          setTitle(found.title)
          setContent(found.content || '')
          setStatus(found.status)
        }
      }catch{}
    }
    load()
  }, [postId])

  async function onSubmit(e) {
    e.preventDefault()
    setMessage('')
    try {
      const client = api(auth)
      let data
      if (postId){
        const res = await client.put(`/posts/${postId}`, { title, content, status })
        data = res.data
      } else {
        const res = await client.post('/posts', { title, content, status })
        data = res.data
      }
      setMessage(`Saved: ${data.title}`)
      if (!postId){
        setTitle('')
        setContent('')
        setStatus('draft')
      }
    } catch (err) {
      setMessage('Failed to save')
    }
  }

  return (
    <div>
      <h2 className="page-title">{postId ? 'Edit Post' : 'New Post'}</h2>
      {message && <div className="badge success">{message}</div>}
      <div className="split">
        <form onSubmit={onSubmit} className="card">
          <Field label="Title">
            <Input value={title} onChange={(e)=>setTitle(e.target.value)} />
          </Field>
          <Field label="Content (Markdown)">
            <Textarea rows={16} value={content} onChange={(e)=>setContent(e.target.value)} />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </Field>
          <div className="actions">
            <Button variant="primary" type="submit">Save</Button>
            <Button type="button" className="ghost" onClick={()=>{setTitle('');setContent('');setStatus('draft')}}>Reset</Button>
          </div>
        </form>
        <div className="preview card">
          <div className="meta">Preview</div>
          <hr className="line" />
          <div dangerouslySetInnerHTML={{ __html: marked.parse(content || 'Start typing to preview…') }} />
        </div>
      </div>
    </div>
  )
}
