/**
 * Gannon Guess
 * gannon@iastate.edu
 * Boudhayan Chakraborty
 * bcb43@iastate.edu
 * December 10, 2024
*/


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./styles/editTeam.css";
import { typeColors } from './TypeColors';

/**
 * Module for editing a pokemon team
 * Pokemon can be removed from the team, or the team can be deleted
 * The team name can be changed, or individual pokemon names can be changed
*/
const EditTeam = () => {
    // mark id as a parameter to be used by calls to the backend
    const { id } = useParams();
    const navigate = useNavigate();

    // stores team being edited
    const [team, setTeam] = useState(null);
    // stores name of team being edited
    const [teamName, setTeamName] = useState('');
    // Holds teams pokemon data in an array
    const [pokemon, setPokemon] = useState([]);  

    // Fetch the current team's data
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

                    setTeamName(data.teamName);
                    setPokemon(data.pokemon || []);
                } catch (error) {
                    alert("Error fetching team: " + error);
                }
            }
        };
        fetchTeam();
    }, [id]);  // every time the team id changes, the page must load that team

    // Set team name if it is changed
    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
    };

    // set pokemon name if it is changed and update team to reflect the change
    const handlePokemonNameChange = (index) => (e) => {
        const updatedPokemon = [...pokemon];
        updatedPokemon[index].name = e.target.value;
        setPokemon(updatedPokemon);
        console.log("new name", updatedPokemon);
    
        // ensure the team data is updated as well
        const updatedTeam = { ...team };
        updatedTeam.pokemon = updatedPokemon;
        setTeam(updatedTeam);
    };

    // handle removing a Pokémon from the team
    const handleRemovePokemon = async (index, event) => {
        event.preventDefault();
        console.log("removing from:", team);
        // send DELETE request to backend
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

            // if the pokemon is removed, update the UI by filtering it out
            const updatedPokemon = pokemon.filter((_, pokeIndex) => pokeIndex !== index);
            setPokemon(updatedPokemon);

            // update the team
            team.pokemon = updatedPokemon;
            setTeam(team);

            // notify the user that the pokemon was removed
            alert('Pokémon removed successfully!');
        } catch (error) {
            alert("There was an error removing the Pokémon: " + error);
        }
    };

    // return to teams page if the user requests to
    const onReturn = () => {
        navigate("/teams");
    };

    // Handle form submission (sending a PUT request)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // old check for if the team was edited
        // if not, saving couldnt happen. Changed so that save always occurs
        // Check if the team data has changed
        // if (teamName === team.teamName && JSON.stringify(pokemon) === JSON.stringify(team.pokemon)) {
        //     navigate("/teams");
        //     return;
        // }


        // set the data to be updated in the team
        const updatedTeam = {
            teamName,
            pokemon
        };

        try {
            // send the PUT request with the updated team data
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

            // alert user that the team was updated
            alert("Team updated successfully!");

            // exit the editor
            navigate('/teams');
        } catch (error) {
            alert("There was an error updating the team: " + error);
        }
    };


    // handle deleting a team
    const handleDelete = async () => {
        // get user confirmation that they want to delete the team
        const confirmDelete = window.confirm("Are you sure you want to delete this team?");
        if (!confirmDelete) return;

        // send DELETE request to the backend to remove the team from the DB
        try {
            const response = await fetch(`http://localhost:8081/teams/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to delete team");
            }
            
            // notify that the team was deleted
            alert("Team deleted successfully!");
            // return to Team view page
            navigate('/teams');
        } catch (error) {
            alert("There was an error deleting the team: " + error);
        }
    };

    // if the team cannot be loaded, show a loading screen
    // mainly debugging
    if (!team) {
        return <p>Loading...</p>;
    }

    // used to show all of the pokemon on the team
    // The team name can be edited, along with an individual pokemon's name
    // the team can also be deleted entirely, or individual pkmn removed
    return (
        <div className="container">
            
            {/* indicate the team being edited */}
            <h2>Editing "{team.teamName}"</h2>
            {/* Allow the user to leave the page */}
            <button onClick={onReturn} className="btn btn-primary">Return</button>
            {/* Create a form for saving changes to DB when submitted */}
            <form onSubmit={handleSubmit}>
                {/* Change team name */}
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

                {/* Pokemon display */}
                <div className="pokemon-edit-cards-container">
                    {pokemon.map((poke, index) => {
                        // get first type of pokemon for card background color
                        const primaryType = poke.types[0].toLowerCase();
                        const backgroundColor = typeColors[primaryType] || "#ffffff";  // Default to white if no color is found
                        // display for the card itself
                        return (
                            // card container
                            <div
                                key={index}
                                className="card"
                                style={{
                                    width: '30%',
                                    margin: '10px',
                                    backgroundColor: backgroundColor, // Dynamically set background color
                                    color: "white", // Ensure text is visible against darker backgrounds
                                }}>
                                {/* image of pkmn */}
                                <img
                                    src={poke.sprites.other['official-artwork'].front_default} // Default placeholder if image is missing
                                    className="card-img-top"
                                    alt={poke.name}
                                    style={{ maxHeight: '200px', objectFit: 'contain' }} // Style to fit the image nicely
                                />
                                <div className="card-body">
                                    <h5 className="card-title">Pokemon {index + 1}</h5>
                                    {/* editable pokemon name */}
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
                                    {/* display pokemon types */}
                                    <p>
                                        <strong>Types: </strong> 
                                        {poke.types?.map((type, typeIndex) => (
                                            <span key={typeIndex} className="badge bg-primary me-1">{type}</span>
                                        )) || 'N/A'}
                                    </p>
                                    {/* display pokemon abilty */}
                                    <p>
                                        <strong>Ability: </strong> 
                                        {poke.abilities?.[0]?.ability?.name ? (
                                            <span className="badge bg-success me-1">{poke.abilities[0].ability.name}</span>
                                        ) : 'N/A'}
                                    </p>
                                    {/* display pokemon moves */}
                                    <p>
                                        <strong>Moves: </strong> 
                                        {poke.moves?.slice(0, 4).map((move, moveIndex) => (
                                            <span key={moveIndex} className="badge bg-secondary me-1">{move}</span>
                                        )) || 'N/A'}
                                    </p>
                                    {/* button to remove pokemon */}
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

                {/* submit button for saving */}
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>

            {/* delete team button */}
            <button onClick={handleDelete} className="btn btn-danger mt-3">
                Delete Team
            </button>
        </div>
    );
};

export default EditTeam;
