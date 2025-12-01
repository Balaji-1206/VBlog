export default function SkeletonCard(){
  return (
    <div className="card">
      <div className="skeleton" style={{height:12, width:160, borderRadius:8}} />
      <div className="skeleton" style={{height:20, width:'70%', borderRadius:8, margin:'10px 0'}} />
      <div className="skeleton" style={{height:12, width:'95%', borderRadius:8, margin:'8px 0'}} />
      <div className="skeleton" style={{height:12, width:'90%', borderRadius:8}} />
    </div>
  )
}
