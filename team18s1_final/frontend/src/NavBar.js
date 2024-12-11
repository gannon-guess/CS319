/**
 * Gannon Guess
 * gannon@iastate.edu
 * Boudhayan Chakraborty
 * bcb43@iastate.edu
 * December 10, 2024
*/
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/navBar.css'; // Import the CSS file

// module for the navigation bar,
// allowing seamless transition between pages
const NavBar = () => {
    return (
        <div className="d-flex justify-content-between p-3 bg-light shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <h2 className="text-center" style={{ marginRight: '20px' }}>Team Builder</h2>
            <ul className="nav">
                {/* link to view teams */}
                <li className="nav-item">
                    <Link to="/teams" className="nav-link text-dark nav-link-outline">
                        My Teams
                    </Link>
                </li>
                {/* link to view pokedex */}
                <li className="nav-item">
                    <Link to="/pokedex" className="nav-link text-dark nav-link-outline">
                        Pokédex
                    </Link>
                </li>
                {/* link to view authors */}
                <li className="nav-item">
                    <Link to="/authors" className="nav-link text-dark nav-link-outline">
                        Authors
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default NavBar;