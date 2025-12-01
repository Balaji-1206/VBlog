import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar(){
  const auth = useAuth()
  return (
    <header className="header">
      <div className="nav container">
        <Link className="brand" to="/">VBlog<span className="dot">.</span></Link>
        <nav className="nav-links">
          <NavLink to="/" className={({isActive})=> isActive? 'badge muted':'badge'}>Home</NavLink>
          <NavLink to="/dashboard" className={({isActive})=> isActive? 'badge muted':'badge'}>Dashboard</NavLink>
          <NavLink to="/editor" className={({isActive})=> isActive? 'badge muted':'badge'}>New Post</NavLink>
            <NavLink to="/profile" className={({isActive})=> isActive? 'badge muted':'badge'}>Profile</NavLink>
        </nav>
        <div className="nav-links">
          {auth.user ? (
            <>
              <span className="badge">Hi, {auth.user.name}</span>
              <button className="button ghost" onClick={auth.logout}>Logout</button>
            </>
          ): (
            <>
              <Link className="button ghost" to="/login">Login</Link>
              <Link className="button primary" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
