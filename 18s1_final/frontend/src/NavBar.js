import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className="d-flex justify-content-between p-3 bg-light shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <h2 className="text-center" style={{ marginRight: '20px' }}>Navigation</h2>
            <ul className="nav">
                {/* <li className="nav-item">
                    <Link to="/" className="nav-link text-dark">Home</Link>
                </li> */}
                <li className="nav-item">
                    <Link to="/teams" className="nav-link text-dark">My Teams</Link>
                </li>
                <li className="nav-item">
                    <Link to="/pokedex" className="nav-link text-dark">Pokédex</Link>
                </li>
                <li className="nav-item">
                    <Link to="/authors" className="nav-link text-dark">Authors</Link>
                </li>
            </ul>
        </div>
    );
};

export default NavBar;