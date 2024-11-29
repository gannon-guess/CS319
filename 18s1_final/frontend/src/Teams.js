import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

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
                alert("There was an Error loading teams: " + error);
            }
        };
        fetchTeams();
    }, []);

    return (
        <div>
            <div className="container">
                <h2 className="text-center mt-4">Teams List</h2>
                <ul className="list-group">
                    {teams.map((team) => (
                        <li key={team.teamId} className="list-group-item d-flex align-items-center">
                            <div>
                                <h5>{team.teamName}</h5>
                                {/* Optional: Render Pokémon names */}
                                <ul>
                                    {team.pokemon.map((poke, index) => (
                                        <li key={index}>
                                            {poke.name} - Level {poke.level}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Teams;