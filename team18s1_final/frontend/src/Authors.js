/**
 * Gannon Guess
 * gannon@iastate.edu
 * Boudhayan Chakraborty
 * bcb43@iastate.edu
 * December 11, 2024
*/

import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import './styles/header.css';
import './styles/authors.css';

// module for displaying the authors of this project
const Authors = () => {
    // for holding the authors.json
    const [authors, setAuthors] = useState(null); 
    
    // fetch the authors.json from the backend to get the text for the page
    // as well as the locations of the images for the page
    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                // fetching authors.json
                const response = await fetch("http://localhost:8081/authors.json"); 
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json(); 
                setAuthors(data);
                console.log(data); 
            } catch (error) {
                alert("There was an error loading authors: " + error);
            }
        };
        fetchAuthors();
    }, []); // run once

    // loading text if authors not loaded yet
    if (!authors) {
        return <div>Loading...</div>;
    }

    // display the header
    const loadHeader = () => {
        if (!authors.header) {
            return <div>No header data available</div>;
        }
        return (
            <div className="header-image" id="header">
                <img src={`http://localhost:8081/images/${authors.header.image}`} alt="Header" />
                <div className="header-text">
                <h1>{authors.header.course}</h1>
                <h2>{authors.header.semester}</h2>
                <h4>{authors.header.professor}</h4>
                <h4>{authors.header.professorEmail}</h4>
                <h4>{authors.header.date}</h4>
                <p>{authors.header.description}</p>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* display header */}
            {loadHeader()}

            {/* Display authors */}
            <div className="container marketing" style={{ marginTop: "80px" }}>
                <div className="row justify-content-center">
                    {/* Map each author in the input file to a card in the grid */}
                    {authors.authors.map((author, index) => (
                        <div key={index} className="col-lg-4 col-md-6 text-center author-box">
                            {/* Author image */}
                            <div className="circle-image">
                                <img src={`http://localhost:8081/images/${author.image}`} alt={author.name} className="img-fluid" />
                            </div>
                            {/* Name */}
                            <h2 className="fw-normal">{author.name}</h2>
                            {/* Contact */}
                            <p><a href={`mailto:${author.email}`}>{author.email}</a></p>
                            {/* Description */}
                            <p>{author.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Authors;