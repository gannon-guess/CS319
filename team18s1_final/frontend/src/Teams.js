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


// Module for displaying all of the pokemon teams the user currently has
// The user can search teams by name, or begin editing teams here
// if a pokemon team is not full, the user has a link to the pokedex on that team
const Teams = ({ teams, setTeams }) => {
    // bool for whether or not to show the create team form
    const [showCreateForm, setShowCreateForm] = useState(false);
    // bool for new team name 
    const [newTeamName, setNewTeamName] = useState('');
    // loading state of the page, mainly debugging
    const [loading, setLoading] = useState(false);
    // search params
    const [searchQuery, setSearchQuery] = useState('');

    // fetch all teams on start
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // use backend to get teams from DB
                const response = await fetch("http://localhost:8081/teams");
                if (!response.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const data = await response.json();

                // sort teams: teams with Pokémon should come first
                const sortedTeams = data.sort((a, b) => {
                    return b.pokemon.length - a.pokemon.length;
                });

                // set the sorted teams to state
                setTeams(sortedTeams);
            } catch (error) {
                alert("There was an error loading teams: " + error);
            }
        };
        fetchTeams();
    }, [setTeams]); // if there are new teams, they need to be fetched

    // Handle form submission to create a new team
    const handleCreateTeam = async (e) => {
        e.preventDefault();

        if (!newTeamName) {
            alert("Team name is required!");
            return;
        }

        setLoading(true);

        // a new team has no pokemon
        const newTeam = {
            teamName: newTeamName,
            pokemon: [],
        };

        try {
            // post the new, empty team
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

            // clear and hide form
            setNewTeamName('');
            setShowCreateForm(false);

        } catch (error) {
            alert("Error creating team: " + error);
        } finally {
            setLoading(false);
        }
    };

    // filter teams based on search query
    const filteredTeams = teams.filter((team) => {
        return team.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    });


    return (
        <div>
            {/* header containing page information for the user
                and a little about the project
            */}
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

                {/* filter search bar */}
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

                {/* button to trigger create team form */}
                <div className="text-center mb-4">
                    <button
                        className="btn btn-success"
                        onClick={() => setShowCreateForm(true)}
                    >
                        Create New Team
                    </button>
                </div>

                {/* new team form */}
                {showCreateForm && (
                    <div className="card mb-4 p-3">
                        <h4>Create New Team</h4>
                        <form onSubmit={handleCreateTeam}>
                            {/* get new team name */}
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
                            {/* button for creating team */}
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

                {/* list of teams */}
                <ul className="list-group">
                    {/* map each team to a container */}
                    {filteredTeams.map((team) => (
                        <li key={team.teamId} className="card mb-5 p-3">
                            <div>
                                <h5>
                                    {team.teamName}
                                </h5>
                                {/* if the team isnt full, have link to pokedex */}
                                {team.pokemon.length < 6 && (
                                    <Link to={`/pokedex`} className="btn btn-primary mb-3">
                                        Add Pokemon
                                    </Link>
                                )}
                                {/* option to edit team */}
                                <div>
                                    <Link to={`/team/edit/${team.teamId}`} className="btn btn-primary mb-3">
                                        Edit Team
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="row">
                                {/* map each pokemon in team to a card */}
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
