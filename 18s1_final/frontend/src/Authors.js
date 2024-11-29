import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import './styles/header.css';
import './styles/authors.css';

const Authors = () => {
  const [authors, setAuthors] = useState(null); // Initial state set to null to handle loading state
  
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("/authors.json"); // Fetching the authors.json file
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parsing the JSON data
        setAuthors(data); // Updating the state with the fetched data
        console.log(data); // Logging the fetched data to check if it's correct
      } catch (error) {
        alert("There was an error loading authors: " + error);
      }
    };
    fetchAuthors(); // Calling the function to fetch the authors data
  }, []); // Empty dependency array means this runs once when the component mounts

  // Handle the case when the authors data hasn't loaded yet
  if (!authors) {
    return <div>Loading...</div>; // Show loading text while authors data is being fetched
  }

  const loadHeader = () => {
    if (!authors.header) {
      return <div>No header data available</div>;
    }

    return (
      <div className="header-image" id="header">
        <img src={authors.header.image} alt="Header Image" />
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
        {loadHeader()}
  
        {/* Bootstrap grid system for author display */}
        <div className="container marketing" style={{ marginTop: "80px" }}>
          <div className="row justify-content-center">
            {authors.authors.map((author, index) => (
              <div key={index} className="col-lg-4 col-md-6 text-center author-box">
                <div className="circle-image">
                  <img src={author.image} alt={author.name} className="img-fluid" />
                </div>
                <h2 className="fw-normal">{author.name}</h2>
                <p><a href={`mailto:${author.email}`}>{author.email}</a></p>
                <p>{author.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Authors;
