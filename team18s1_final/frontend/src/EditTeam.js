import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./styles/editTeam.css";
import { typeColors } from './TypeColors';

const EditTeam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [pokemon, setPokemon] = useState([]);  // Array to hold pokemon data

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

    // Handle input changes for team name
    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
    };

    // Handle input changes for Pokemon nickname
    const handlePokemonNameChange = (index) => (e) => {
        const updatedPokemon = [...pokemon];
        updatedPokemon[index].name = e.target.value;  // Update the name of the pokemon with the provided index
        setPokemon(updatedPokemon);
        console.log("new name", updatedPokemon);
    
        // Ensure the team data is updated as well
        const updatedTeam = { ...team };
        updatedTeam.pokemon = updatedPokemon; // Update the team's pokemon list with the new data
        setTeam(updatedTeam); // Update the state with the modified team
    };

    // Handle removing a Pokémon from the team (UI and backend update)
    const handleRemovePokemon = async (index, event) => {
        event.preventDefault();  // Prevent form submission on "Remove Pokemon" button click
        console.log("removing from:", team);
        // Send DELETE request to backend
        try {
            const response = await fetch(`http://localhost:8081/teams/remove-pokemon/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ index })  // Send the index to remove
            });

            if (!response.ok) {
                throw new Error('Failed to remove Pokémon');
            }

            // If successful, update the UI by removing the Pokémon from the state
            const updatedPokemon = pokemon.filter((_, pokeIndex) => pokeIndex !== index);
            setPokemon(updatedPokemon);

            team.pokemon = updatedPokemon;
            setTeam(team);

            console.log("team with removed: ", team);

            // Show an alert to confirm the removal
            alert('Pokémon removed successfully!');
        } catch (error) {
            alert("There was an error removing the Pokémon: " + error);
        }
    };

    const onReturn = () => {
        navigate("/teams");
    };

    // Handle form submission (sending a PUT request)
   const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the team data has changed
    // if (teamName === team.teamName && JSON.stringify(pokemon) === JSON.stringify(team.pokemon)) {
    //     navigate("/teams");
    //     return;
    // }


    // Prepare the updated team data, including pokemon
    const updatedTeam = {
        teamName,
        pokemon
    };

    try {
        // Send the PUT request with the updated team data
        const response = await fetch(`http://localhost:8081/teams/edit/${id}`, {
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
    } catch (error) {
        alert("There was an error updating the team: " + error);
    }
};


    // Handle team deletion (sending a DELETE request)
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this team?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8081/teams/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to delete team");
            }

            alert("Team deleted successfully!");
            navigate('/teams');
        } catch (error) {
            alert("There was an error deleting the team: " + error);
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

                {/* Pokémon Cards */}
                <div className="pokemon-edit-cards-container">
                    {pokemon.map((poke, index) => {
                        // Get the first type for background color (assuming typeColors is available)
                        const primaryType = poke.types[0].toLowerCase();
                        const backgroundColor = typeColors[primaryType] || "#ffffff";  // Default to white if no color is found

                        return (
                            <div
                                key={index}
                                className="card"
                                style={{
                                    width: '30%',
                                    margin: '10px',
                                    backgroundColor: backgroundColor, // Dynamically set background color
                                    color: "white", // Ensure text is visible against darker backgrounds
                                }}>
                                <img
                                    src={poke.sprites.other['official-artwork'].front_default} // Default placeholder if image is missing
                                    className="card-img-top"
                                    alt={poke.name}
                                    style={{ maxHeight: '200px', objectFit: 'contain' }} // Style to fit the image nicely
                                />
                                <div className="card-body">
                                    <h5 className="card-title">Pokemon {index + 1}</h5>
                                    {/* Editable Pokemon Name (Nickname) */}
                                    <div className="mb-3">
                                        <label className="form-label">Nickname</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={poke.name} // Use current nickname or default name
                                            onChange={handlePokemonNameChange(index)} // Update the name for the specific pokemon
                                            placeholder={poke.name}
                                        />
                                    </div>
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
                                    <button
                                        className="btn btn-danger"
                                        onClick={(event) => handleRemovePokemon(index, event)} // Pass the event object here
                                    >
                                        Remove Pokemon
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Submit Button for Team */}
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>

            {/* Delete Button */}
            <button onClick={handleDelete} className="btn btn-danger mt-3">
                Delete Team
            </button>
        </div>
    );
};

export default EditTeam;
