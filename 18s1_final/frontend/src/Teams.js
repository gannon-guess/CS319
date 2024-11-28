import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

// Gannon Guess
// gannon@iastate.edu
// Boudhayan Chakraborty
// bcb43@iastate.edu
// November 23, 2024

const Teams = ({ teams, setTeams }) => {
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch("http://localhost:8081/teams");
                if (!response.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const data = await response.json();
                setTeams(data);
            } catch (error) {
                alert("There was an Error loading teams "+error);
            }
        };
        fetchTeams();
    }, []);




    return (
        <div className="container">
            <h2 className="text-center mt-4">Teams List</h2>
            <ul className="list-group">
                {teams.map((teams) => (
                    <li key={teams.id} className="list-group-item d-flex align-items-center">
                        {/* {teams.image_url && (
                            // <img
                            //     src={`http://localhost:8081${teams.image_url}`}
                            //     alt={teams.teams_name}
                            //     style={{ width: '50px', height: 'auto', marginRight: '15px', objectFit: 'cover' }}
                            // />
                        )} */}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Teams;