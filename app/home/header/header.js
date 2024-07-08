import './header.css'

// Header component
const Header = () => {
    return (
        <div className='head'>
            <div className='img'></div>
            <div className='content'>
                <h2>Here, we all love</h2>
                <h1>Books</h1>
                <h3>You can find, read and give your review</h3>
                <h3>all for Free.</h3>
                <div><a href='../search'>Explore</a></div>
            </div>
        </div>
    );
};

export default Header;