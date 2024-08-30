import React, { useEffect } from 'react'
import {Link,useLocation} from "react-router-dom";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Navbar = () => {
    //const [user, setUser] = useState(null);
    let history = useHistory();
    let loc=useLocation();
    useEffect(()=>{
    },[loc]);
    const handleLogout=()=>{
        localStorage.removeItem('token');
        history.push('/login');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">NimbusNotes</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${loc.pathname==="/"?"active":""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${loc.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                        </li>
                    </ul>
                    {!localStorage.getItem('token')?<form className='d-flex'>
                    <Link className="btn btn-primary mx-1" to='/login' role="button">Login</Link>
                    <Link className="btn btn-primary mx-1" to='/signup' role="button">SignUp</Link>
                    </form>: 
                            <button onClick={handleLogout} className='btn btn-primary'>Logout</button>
                        }
                </div>
            </div>
        </nav>
    )
}

export default Navbar