import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import './header.styles.css'
import NewPantryItem from '../modals/NewPantryItem';
import { MdAccountCircle, MdArrowDropDown, MdOutlineSearch } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navbarRef = useRef(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const { isLoggedIn, username, logout } = useAuth();

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const openModal = function() {
        setIsModalOpen(true);
        setDropdownOpen(false);
    }
    const closeModal = () => setIsModalOpen(false);

    function handleLogout() {
        logout();
        navigate('/');
    }

    function handleNavSearch(e) {
        e.preventDefault()
        navigate(`/search?q=${e.target.query.value}&t=all`)
    }

    return (
        <>
        <div className='pantry-nav' ref={navbarRef}>
            <div className='navbar-left'>
                <NavLink to='/' style={({ isActive }) => isActive ? { color: '#C0563E'} : { color: 'black'}} className='navbar-brand'>
                    Pantry
                </NavLink>
                <NavLink to='/' className={({ isActive, isPending }) => `navbar-link ${isPending ? "pending"  : isActive ? "active" : ""}` }>
                        Recipes
                </NavLink>
                <NavLink to='/search' className={({ isActive, isPending }) => `navbar-link ${isPending ? "pending"  : isActive ? "active" : ""}` }>
                        Search
                </NavLink>
                <NavLink to='/about' className={({ isActive, isPending }) => `navbar-link ${isPending ? "pending"  : isActive ? "active" : ""}` }>
                        About
                </NavLink>
            </div>
            <div className='navbar-right'>
                <form className='pantry-nav-search' onSubmit={handleNavSearch}>
                    <MdOutlineSearch color='black' />
                    <input  
                        key={query}
                        type='text'
                        name='query'
                        placeholder='Search...'
                        defaultValue={query || ''}
                        aria-label='Search'
                    />
                </form>
                    {!isLoggedIn && (
                            <div className='pantry-nav-unauthenticated'>
                                <Link to={'/login'}>Log in</Link>
                                <Link to={'/sign-up'}>Sign up</Link>
                            </div>
                    )}
                    {isLoggedIn && (
                        <div className='pantry-heading-user'>
                                <div className='pantry-heading nav-dropdown-container'>
                                    <MdAccountCircle size='1.5rem' color='black' className='pantry-heading-profile-icon' onClick={() => navigate(`/user/${username}`)} />
                                    <p className='nav-dropdown-button' onClick={toggleDropdown}>
                                        {username} <MdArrowDropDown color='black' />
                                    </p>
                                    {dropdownOpen && (
                                        <ul className='nav-dropdown-menu'>
                                            <li><Link to={`/user/${username}`} className='pantry-heading'>My Profile</Link></li>
                                            <li><Link to={`/search`} className='pantry-heading'>Search</Link></li>
                                            <li><Link to={`/new-recipe`} className='pantry-heading'>New Recipe</Link></li>
                                            <li onClick={openModal} className='pantry-heading'>New Pantry Item</li>
                                            <li onClick={handleLogout}>Logout</li>
                                        </ul>
                                    )}
                                </div>
                        </div>
                    )}
            </div>
        </div>
        <NewPantryItem isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onClose={closeModal} />
        </>
    )
}