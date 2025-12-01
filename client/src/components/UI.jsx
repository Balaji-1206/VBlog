export function Button({children, variant='soft', size='md', iconLeft, iconRight, ...props}){
  const cls = ['button']
  if(variant) cls.push(variant)
  if(size==='sm') cls.push('sm')
  if(size==='lg') cls.push('lg')
  return (
    <button className={cls.join(' ')} {...props}>
      {iconLeft && <span className="icon" aria-hidden>{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="icon" aria-hidden>{iconRight}</span>}
    </button>
  )
}

export function Field({label, hint, children}){
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      {children}
      {hint && <div className="meta">{hint}</div>}
    </div>
  )
}

export function Input(props){
  return <input className="input" {...props} />
}
export function Textarea(props){
  return <textarea className="textarea" {...props} />
}
export function Select(props){
  return <select className="select" {...props} />
}
