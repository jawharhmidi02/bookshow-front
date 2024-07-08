import './header.css'

// Header component
const Header = ({name}) => {
    return (
        <div className='head'>
            <div className='img'></div>
            <div className='content'>
                <h2>Welcome</h2>
                <h1>{name}</h1>
            </div>
        </div>
    );
};

export default Header;