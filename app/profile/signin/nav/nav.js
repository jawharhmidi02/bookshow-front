import './nav.css';

const Nav = ()=> {

    return(
        <nav>
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
                <a href="../profile">
                    <span className="material-symbols-outlined">
                        person
                    </span>
                </a>
            </div>
        </nav>
    )
}

export default Nav;