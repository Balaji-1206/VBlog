import Navbar from './Navbar'

export default function Layout({ children }){
  return (
    <>
      <Navbar />
      <main className="container" style={{paddingTop:24}}>
        {children}
      </main>
      <footer className="footer">© {new Date().getFullYear()} VBlog</footer>
    </>
  )
}
