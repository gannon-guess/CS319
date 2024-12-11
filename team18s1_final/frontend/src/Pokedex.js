/**
 * Gannon Guess
 * gannon@iastate.edu
 * Boudhayan Chakraborty
 * bcb43@iastate.edu
 * December 10, 2024
*/

import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap'; // Import Bootstrap components
import { typeColors } from './TypeColors.js';

// function for capitalizing the first letter of a word
// this is useful for pokemon names which come lowercase
function capitalizeFirstLetter(str) {
    if (!str) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Module for displaying all of the Pokemon in the pokedex page
// at this time, this consits of only the Kanto pokemon
// Pokemon can be filtered using the search bar at the top of the page
function Pokedex({ pokedex, setPokedex, teams, setTeams }) {
    const [filterName, setFilterName] = useState('');

    // apply filters to the pokedex, for user filtering
    const filteredPokedex = pokedex.filter(pokemon => {
        const nameMatch = pokemon.name.toLowerCase().includes(filterName.toLowerCase());
        const idMatch = pokemon.id.toString().includes(filterName);
        const typeMatch = pokemon.types.some(type => type.toLowerCase().includes(filterName.toLowerCase()));
        return nameMatch || idMatch || typeMatch;
    });

    // on the first load, all of the pokemon must be obtained
    useEffect(() => {
        // fetch teams may go unused, keeping for testing
        const fetchTeams = async () => {
            try {
                const response = await fetch("http://localhost:8081/teams");
                if (!response.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const data = await response.json();
                setTeams(data);
            } catch (error) {
                console.error("Error fetching teams:", error);
                alert("Failed to load teams");
            }
        };
        fetchTeams();
        
        // fetch pokemon data from the return from the PokeApi
        // after the API gives everything, we must parse what we want from it
        const fetchPokemonData = async (pokemon) => {
            try {
                const response = await fetch(pokemon.url);
                if (!response.ok) {
                    throw new Error("Failed to fetch individual pokemon data");
                }
                const pokeData = await response.json();

                // Get the data that we want from the pokemon
                // if we get too much, then the DB cannot take the query
                // because it is too big
                const pokemonSummary = {
                    id: pokeData.id,
                    name: capitalizeFirstLetter(pokeData.name),
                    sprites: {
                        other: {
                            ['official-artwork']: {
                                front_default: pokeData.sprites.other['official-artwork'].front_default
                            }
                        }  
                    },
                    types: pokeData.types.map(typeInfo => typeInfo.type.name),  // Get all types
                    height: pokeData.height,
                    weight: pokeData.weight,
                    moves: pokeData.moves.slice(0, 4).map(move => move.move.name),
                    abilities: pokeData.abilities
                };

                return pokemonSummary;
            } catch (error) {
                console.error("Error fetching pokemon data:", error);
            }
        }
        
        // function for obtaining the Kanto pokemon, which is easier to manage for testing
        const fetchKantoPokemon = async () => {
            try {
                // fetch the first 151 pokemon (kanto), from Pokeapi
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
                if (!response.ok) {
                    throw new Error("Failed to fetch pokemon");
                }
                const data = await response.json();

                // mow fetch data for each individual Pokémon
                const pokemonDataPromises = data.results.map(fetchPokemonData);

                
                const allPokemonData = await Promise.all(pokemonDataPromises);

                // set the fetched data
                setPokedex(allPokemonData);
            } catch (error) {
                alert("There was an Error loading pokemon " + error);
            }
        };
        // fetch the kanto pokemon
        fetchKantoPokemon();
    }, []);

    // function to handle adding a Pokémon to a selected team
    const handleAddToTeam = async (pokemon, teamId) => {


        // Find the team by teamId
        console.log(teams);
        const selectedTeam = teams.find((team) => team.teamId === teamId);

        console.log("team to add to", selectedTeam);

        if (!selectedTeam) {
            alert("Team not found!");
            return;
        }
        if (selectedTeam.pokemon.length >= 6) {
            alert("This team is already full!");
            return;
        }
        console.log("selected:", selectedTeam);

        
        console.log("sending up:", pokemon);


        // use PUT to send the updated team to the backend
        try {
            const response = await fetch(`http://localhost:8081/teams/add/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pokemon) // Send the updated team object
            });

            if (!response.ok) {
                throw new Error("Failed to update team");
            }
            
            const updatedTeamData = await response.json();

            // update the frontend state to reflect the changes
            setTeams(prevTeams => 
                prevTeams.map(team =>
                    team.teamId === teamId ? updatedTeamData : team
                )
            );
            // tell the user the team has been updated with a new pokemon
            alert(`${pokemon.name} added to team (${selectedTeam.pokemon.length + 1}/6)!`);
        } catch (error) {
            console.error("Error adding Pokémon to team:", error);
            alert("Failed to add Pokémon to the team.");
        }
    };

    // has a filter, all of the pokemon, and the ability to add them to teams
    return (
        <div className="container">
            {/* filtering search bar */}
            <div className="my-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Pokémon by Name, Number, or Type"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
            </div>

            {/* start of Kanto Pokemon List */}
            <h1 className="text-center my-5">Kanto Pokémon</h1>

            <div className="container">
                <div className="row">
                    {/* map each pokemon to a card */}
                    {filteredPokedex.map((pokemon, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-3 mb-4">
                            {/* set background color based on the first type */}
                            <div 
                                className="card" 
                                style={{
                                    backgroundColor: typeColors[pokemon.types[0].toLowerCase()] || "#ffffff",
                                    color: "white", // You may want to adjust text color for contrast
                                    minHeight: "350px", // Keep the card height consistent
                                }}
                            >
                                {/* pokemon ID/dex number */}
                                <h1 className="mx-3 mt-2" style={{ fontSize: "1.5rem" }}>
                                    {pokemon.id}
                                </h1>
                                
                                {/* pokemon sprite/image */}
                                <img
                                    src={pokemon.sprites.other['official-artwork'].front_default}
                                    className="card-img-top"
                                    alt={pokemon.name}
                                    style={{
                                        height: '150px', // Set a fixed height for the image
                                        width: 'auto',   // Ensure it scales proportionally
                                        objectFit: 'contain', // Keep the image inside the card without stretching
                                    }}
                                />
                                {/* card contents */}
                                <div className="card-body p-2">
                                    {/* name */}
                                    <h5 className="card-title" style={{ fontSize: "1.1rem" }}>
                                        {pokemon.name}
                                    </h5>
                                    {/* types */}
                                    <p className="card-text" style={{ fontSize: "0.85rem" }}>
                                        <strong>Type:</strong> {pokemon.types.join(", ")}
                                    </p>
                                    {/* height */}
                                    <p className="card-text" style={{ fontSize: "0.85rem" }}>
                                        <strong>Height:</strong> {pokemon.height} decimeters
                                    </p>
                                    {/* weight */}
                                    <p className="card-text" style={{ fontSize: "0.85rem" }}>
                                        <strong>Weight:</strong> {pokemon.weight} hectograms
                                    </p>

                                    {/* dropdown button to add pkmn to team 
                                        displays only if a team exists
                                    */}
                                    {teams.length > 0 &&
                                        <Dropdown>
                                            <Dropdown.Toggle variant="primary" id={`dropdown-${pokemon.name}`} size="sm">
                                                Add to Team
                                            </Dropdown.Toggle>
                                            {/* allows selection of any available team 
                                                also displays the number of pokemon currently in the team
                                            */}
                                            <Dropdown.Menu>
                                                {teams.map((team) => (
                                                    <Dropdown.Item
                                                        key={team.teamId}
                                                        onClick={() => handleAddToTeam(pokemon, team.teamId)}
                                                    >
                                                        {team.teamName + "  (" + team.pokemon.length + "/6)"}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Pokedex;
