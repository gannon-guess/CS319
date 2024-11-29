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
                alert("There was an error loading teams: " + error);
            }
        };
        fetchTeams();
    }, [setTeams]); // Adding setTeams to the dependency array to avoid potential issues



    return (
        <div>
            <div className="container">
                <h2 className="text-center mt-4">Teams List</h2>
                <ul className="list-group">
                    {teams.map((team) => (
                        <li key={team.teamId} className="card mb-5 p-3">
                            <h5>{team.teamName}</h5>
                            {/* TODO: edit button to link to edit page with currentTeam */}
                            {/* <Button>
                                <Link to="/team/edit/" className="nav-link text-dark">Pokedex</Link>
                            </Button> */}
                            
                            {/* Pokemon Grid */}
                            {/* TODO: onclick a pokemon, pull up its info/stats on an info page */}
                            <div className="row">
                                {/* Loop through the first 6 Pokémon of each team */}
                                {team.pokemon.slice(0, 6).map((poke, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                                        <div className="card" style={{ width: "100%" }}>
                                            <img
                                                src={poke.sprites.other['official-artwork'].front_default}
                                                className="card-img-top"
                                                alt={poke.name}
                                                style={{ height: '200px', width: "auto", objectFit: 'contain' }} // Ensure image covers the card area
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{poke.name}</h5>
                                                <p className="card-text">Level {poke.level}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Teams;
