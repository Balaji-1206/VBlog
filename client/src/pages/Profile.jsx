import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { Button, Field, Input } from '../components/UI'

function Avatar({ name }){
  const initials = (name||'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
  return (
    <div style={{
      width:88,height:88,borderRadius:'50%',
      background:'radial-gradient(120px 120px at 50% 0%, #2f3461 0%, #162036 60%)',
      display:'grid',placeItems:'center',fontWeight:800,fontSize:22,
      border:'2px solid #2a3954', boxShadow:'0 10px 24px rgba(0,0,0,.35)'
    }}>
      {initials}
    </div>
  )
}

export default function Profile(){
  const auth = useAuth()
  const qc = useQueryClient()
  const client = api(auth)

  const profile = useQuery({
    queryKey: ['me'],
    queryFn: async ()=> (await client.get('/users/me')).data
  })
  const stats = useQuery({
    queryKey: ['me','stats'],
    queryFn: async ()=> (await client.get('/users/me/stats')).data
  })

  const updateName = useMutation({
    mutationFn: async (name)=> (await client.put('/users/me', { name })).data,
    onSuccess: ()=> { qc.invalidateQueries({queryKey:['me']}) }
  })

  const changePassword = useMutation({
    mutationFn: async (payload)=> (await client.put('/users/me/password', payload)).data
  })

  if (profile.isLoading) return <div className="card"><div className="skeleton" style={{height:24,width:'40%',borderRadius:8}}/><div className="skeleton" style={{height:12,width:'70%',borderRadius:8,marginTop:8}}/></div>
  if (profile.error) return <div className="card">Failed to load profile</div>

  const u = profile.data

  return (
    <div className="grid">
      <section className="card" style={{padding:24}}>
        <div style={{display:'flex',gap:20,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:16,alignItems:'center'}}>
            <Avatar name={u.name} />
            <div>
              <div className="page-title" style={{margin:0}}>{u.name}</div>
              <div className="meta">{u.email}</div>
              <div className="meta">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,auto)',gap:8}}>
            <div className="badge"><span className="icon"/>Total: {stats.data?.total ?? '–'}</div>
            <div className="badge success"><span className="icon"/>Published: {stats.data?.published ?? '–'}</div>
            <div className="badge warning"><span className="icon"/>Draft: {stats.data?.draft ?? '–'}</div>
          </div>
        </div>
      </section>

      <section className="card" style={{padding:24}}>
        <h3 style={{marginTop:0}}>Profile</h3>
        <div className="grid">
          <Field label="Name">
            <div style={{display:'flex',gap:8}}>
              <Input defaultValue={u.name} id="nameInput" />
              <Button variant="primary" iconLeft={<span>✔</span>} onClick={()=>{
                const el = document.getElementById('nameInput')
                updateName.mutate(el.value)
              }}>
                {updateName.isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </Field>
          <Field label="Email" hint="Email changes not supported in this demo">
            <Input value={u.email} disabled />
          </Field>
        </div>
      </section>

      <section className="card" style={{padding:24}}>
        <h3 style={{marginTop:0}}>Security</h3>
        <div className="grid">
          <Field label="Current Password"><Input type="password" id="curPwd" /></Field>
          <Field label="New Password"><Input type="password" id="newPwd" /></Field>
          <div className="actions">
            <Button variant="warning" iconLeft={<span>🔒</span>} onClick={()=>{
              const currentPassword = document.getElementById('curPwd').value
              const newPassword = document.getElementById('newPwd').value
              changePassword.mutate({ currentPassword, newPassword })
            }}>{changePassword.isPending ? 'Updating…':'Update Password'}</Button>
            {changePassword.isSuccess && <span className="badge success">Updated</span>}
            {changePassword.isError && <span className="badge warning">Failed</span>}
          </div>
        </div>
      </section>
    </div>
  )
}
