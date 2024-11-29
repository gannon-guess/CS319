import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

const Teams = ({ teams, setTeams }) => {
    const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle form visibility
    const [newTeamName, setNewTeamName] = useState(''); // Team name input state
    const [loading, setLoading] = useState(false); // Loading state to manage POST request state

    // Fetch teams on mount
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
            setTeams((prevTeams) => [...prevTeams, createdTeam]); // Add new team to state

            // Clear form and hide it
            setNewTeamName('');
            setShowCreateForm(false);
            
        } catch (error) {
            alert("Error creating team: " + error);
        } finally {
            setLoading(false);
            console.log(teams);
        }
    };

    return (
        <div>
            <div className="container">
                <h2 className="text-center mt-4">Teams List</h2>

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

                <ul className="list-group">
                    {teams.map((team) => (
                        <li key={team.teamId} className="card mb-5 p-3">
                            <div>
                                <h5>{team.teamName}</h5>
                                <Link to={`/team/edit/${team.teamId}`} className="btn btn-primary mb-3">
                                    Edit
                                </Link>
                            </div>
                            
                            <div className="row">
                                {team.pokemon.slice(0, 6).map((poke, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                                        <div className="card" style={{ width: "100%" }}>
                                            <img
                                                src={poke.sprites.other['official-artwork'].front_default}
                                                className="card-img-top"
                                                alt={poke.name}
                                                style={{ height: '200px', width: "auto", objectFit: 'contain' }} 
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{poke.name}</h5>
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
