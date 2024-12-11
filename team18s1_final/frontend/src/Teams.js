/**
 * Gannon Guess
 * gannon@iastate.edu
 * Boudhayan Chakraborty
 * bcb43@iastate.edu
 * December 10, 2024
*/

import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { typeColors } from './TypeColors.js';

const Teams = ({ teams, setTeams }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');  // State to manage the search input

    // Fetch teams on mount
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch("http://localhost:8081/teams");
                if (!response.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const data = await response.json();

                // Sort teams: teams with Pokémon should come first
                const sortedTeams = data.sort((a, b) => {
                    return b.pokemon.length - a.pokemon.length;
                });

                // Set the sorted teams to state
                setTeams(sortedTeams);
            } catch (error) {
                alert("There was an error loading teams: " + error);
            }
        };
        fetchTeams();
    }, [setTeams]);

    // Handle form submission to create a new team
    const handleCreateTeam = async (e) => {
        e.preventDefault();

        if (!newTeamName) {
            alert("Team name is required!");
            return;
        }

        setLoading(true);

        const newTeam = {
            teamName: newTeamName,
            pokemon: [], // Initialize with an empty array for pokemon
        };

        try {
            const response = await fetch("http://localhost:8081/teams", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTeam),
            });

            if (!response.ok) {
                throw new Error("Failed to create new team");
            }

            const createdTeam = await response.json();
            setTeams((prevTeams) => [...prevTeams, createdTeam]);

            // Clear form and hide it
            setNewTeamName('');
            setShowCreateForm(false);

        } catch (error) {
            alert("Error creating team: " + error);
        } finally {
            setLoading(false);
        }
    };

    // Filter teams based on search query
    const filteredTeams = teams.filter((team) => {
        return team.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div>
            <div className="bg-light py-4 mb-4 shadow-sm border-top border-primary">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 text-center">
                            <h4 className="text-primary">Welcome to the Pokémon Team Manager!</h4>
                            <p>
                                Create, manage, and edit your Pokémon teams. Use the search bar below to quickly find teams you have created by name. The Pokedex page can be used to add Pokemon to your teams.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h2 className="text-center mt-4">Teams List</h2>

                {/* Search Bar */}
                <div className="text-center mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search teams by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                        style={{ width: '300px', margin: '0 auto' }}
                    />
                </div>

                {/* Button to trigger form */}
                <div className="text-center mb-4">
                    <button
                        className="btn btn-success"
                        onClick={() => setShowCreateForm(true)}
                    >
                        Create New Team
                    </button>
                </div>

                {/* Create New Team Form */}
                {showCreateForm && (
                    <div className="card mb-4 p-3">
                        <h4>Create New Team</h4>
                        <form onSubmit={handleCreateTeam}>
                            <div className="mb-3">
                                <label htmlFor="teamName" className="form-label">Team Name</label>
                                <input
                                    type="text"
                                    id="teamName"
                                    className="form-control"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    placeholder="Enter team name"
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Create Team"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Teams List */}
                <ul className="list-group">
                    {filteredTeams.map((team) => (
                        <li key={team.teamId} className="card mb-5 p-3">
                            <div>
                                <h5>
                                    {team.teamName}
                                </h5>

                                {team.pokemon.length < 6 && (
                                    <Link to={`/pokedex`} className="btn btn-primary mb-3">
                                        Add Pokemon
                                    </Link>
                                )}
                                <div>
                                    <Link to={`/team/edit/${team.teamId}`} className="btn btn-primary mb-3">
                                        Edit Team
                                    </Link>
                                </div>
                            </div>

                            <div className="row">
                                {team.pokemon.slice(0, 6).map((poke, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                                        <div
                                            className="card"
                                            style={{
                                                width: "100%",
                                                backgroundColor: typeColors[poke.types[0].toLowerCase()] || "#ffffff", 
                                                color: "white",
                                            }}>
                                            <img
                                                src={poke.sprites.other['official-artwork'].front_default}
                                                className="card-img-top"
                                                alt={poke.name}
                                                style={{
                                                    height: '200px',
                                                    width: 'auto',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                            <div className="card-body">

                                                <h5 className="card-title">{poke.name}</h5>

                                                <p>
                                                    <strong>Types: </strong> 
                                                    {poke.types?.map((type, typeIndex) => (
                                                        <span key={typeIndex} className="badge bg-primary me-1">{type}</span>
                                                    )) || 'N/A'}
                                                </p>


                                                <p>
                                                    <strong>Ability: </strong> 
                                                    {poke.abilities?.[0]?.ability?.name ? (
                                                        <span className="badge bg-success me-1">{poke.abilities[0].ability.name}</span>
                                                    ) : 'N/A'}
                                                </p>



                                                <p>
                                                    <strong>Moves: </strong> 
                                                    {poke.moves?.slice(0, 4).map((move, moveIndex) => (
                                                        <span key={moveIndex} className="badge bg-secondary me-1">{move}</span>
                                                    )) || 'N/A'}
                                                </p>
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
