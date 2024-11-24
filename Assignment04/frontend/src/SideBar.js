import React from 'react';
import { Link } from 'react-router-dom';

// Gannon Guess
// gannon@iastate.edu
// Boudhayan Chakraborty
// bcb43@iastate.edu
// November 23, 2024

const Sidebar = () => {
    return (
        <div className="d-flex flex-column vh-100 p-3 bg-light" style={{ width: '250px' }}>
            <h2 className="text-center">Navigation</h2>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/" className="nav-link text-dark">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/contacts" className="nav-link text-dark">View Contacts</Link>
                </li>
                <li className="nav-item">
                    <Link to="/add-contact" className="nav-link text-dark">Add Contact</Link>
                </li>
                <li className="nav-item">
                    <Link to="/deletecontact" className="nav-link text-dark">Delete Contact</Link>
                </li>
                <li className="nav-item">
                    <Link to="/searchContacts" className="nav-link text-dark">Search Contacts</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;