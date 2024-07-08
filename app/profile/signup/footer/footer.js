import './footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <nav className='footer-nav'>
                <div className="logo">
                    <a href=''>Book Store</a>
                </div>
                <div className="links">
                    <div onClick={()=>{window.location.href='../home'}}>Home</div>
                    <div onClick={()=>{window.location.href='../books'}}>Books</div>
                    <div onClick={()=>{window.location.href='../search'}}>Search</div>
                    <div onClick={()=>{window.location.href='../about'}}>About</div>
                </div>
                <div className="profile">
                    <a href="https://www.facebook.com/jawhar.hmidi.5" className="fa fa-facebook"></a>
                    <a href="https://www.linkedin.com/in/jawharhmidi/" className="fa fa-linkedin"></a>
                    <a href="https://github.com/jawharhmidi02" className="fa fa-github"></a>
                </div>
            </nav>
            <hr />
            <p>Copyright © 2024 Book Store. All rights reserved. Visit us <a href="https://luminous-centaur-d51d22.netlify.app/">here</a>.</p>

        </footer>
    )
}

export default Footer;