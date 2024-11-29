import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams hook to access the teamId from the URL

const EditTeam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    
    // State variables for the form fields
    const [teamName, setTeamName] = useState('');
    const [pokemon, setPokemon] = useState([]);  // You can set this depending on your structure of pokemon

    // Fetch the current team data when the component mounts
    useEffect(() => {
        const fetchTeam = async () => {
            if (id) {
                try {
                    const response = await fetch(`http://localhost:8081/teams/${id}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch team data");
                    }
                    const data = await response.json();
                    setTeam(data);

                    // Initialize state variables with the fetched data
                    setTeamName(data.teamName);
                    setPokemon(data.pokemon || []);  // Assuming pokemon is an array
                } catch (error) {
                    alert("Error fetching team: " + error);
                }
            }
        };

        fetchTeam();
    }, [id]);

    // Handle input changes
    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
    };

    const handlePokemonChange = (e, index) => {
        const updatedPokemon = [...pokemon];
        updatedPokemon[index] = { ...updatedPokemon[index], name: e.target.value };
        setPokemon(updatedPokemon);
    };

    const onReturn = async () => {
        navigate("/teams")
    }

    // Handle form submission (sending a PUT request)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (teamName === team.teamName) {
            // If no changes, navigate back to the previous page
            navigate("/teams"); // This will go back to the previous page (similar to the browser's back button)
            return;
        }
        
        // Prepare updated team data
        const updatedTeam = {
            teamName
        };

        try {
            const response = await fetch(`http://localhost:8081/teams/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTeam)
            });

            if (!response.ok) {
                throw new Error('Failed to update team');
            }

            const updatedData = await response.json();
            alert("Team updated successfully!");
            navigate('/teams');
            // Redirect to another page (e.g., team list)
        } catch (error) {
            alert("There was an error updating the team: " + error);
        }
    };

    if (!team) {
        return <p>Loading...</p>;
    }
    

    return (
        <div className="container">
            <button onClick={onReturn} className="btn btn-primary">Return</button>
            <h2>Editing {team.teamName}</h2>
            <form onSubmit={handleSubmit}>
                {/* Team Name */}
                <div className="mb-3">
                    <label className="form-label">Team Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={teamName}
                        onChange={handleTeamNameChange}
                        placeholder={team.teamName}
                    />
                </div>

                {/* Pokemon Names */}
                {pokemon.map((poke, index) => (
                    <div key={index} className="mb-3">
                        <label className="form-label">Pokemon {index + 1} Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={poke.name}
                            onChange={(e) => handlePokemonChange(e, index)}
                            placeholder={poke.name} // Pre-fill with current name
                        />
                    </div>
                ))}

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default EditTeam;
