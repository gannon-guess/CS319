import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap'; // Import Bootstrap components

function Pokedex({ pokedex, setPokedex, teams, setTeams }) {
    const [filterName, setFilterName] = useState('');

    const filteredPokedex = pokedex.filter(pokemon =>
        pokemon.name.toLowerCase().includes(filterName.toLowerCase())
    );

    useEffect(() => {
        const fetchPokemonData = async (pokemon) => {
            try {
                const response = await fetch(pokemon.url);
                if (!response.ok) {
                    throw new Error("Failed to fetch individual pokemon data");
                }
                const pokeData = await response.json();

                const pokemonSummary = {
                    id: pokeData.id,
                    name: pokeData.name,
                    sprites: {
                        other: {
                            ['official-artwork']: {
                                front_default: pokeData.sprites.other['official-artwork'].front_default
                            }
                        }  
                    },
                    types: pokeData.types.map(typeInfo => typeInfo.type.name),  // Get all types
                    height: pokeData.height,
                    weight: pokeData.weight
                };
                // console.log(pokemonSummary)

                return pokemonSummary;
            } catch (error) {
                console.error("Error fetching pokemon data:", error);
            }
        }

        const fetchKantoPokemon = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
                if (!response.ok) {
                    throw new Error("Failed to fetch pokemon");
                }
                const data = await response.json();

                // Now fetch data for each individual Pokémon
                const pokemonDataPromises = data.results.map(fetchPokemonData);

                // Wait for all Pokémon data to be fetched
                const allPokemonData = await Promise.all(pokemonDataPromises);

                // Set the fetched data into state
                setPokedex(allPokemonData);
            } catch (error) {
                alert("There was an Error loading pokemon " + error);
            }
        };

        fetchKantoPokemon();
    }, [setPokedex]);

    // Function to handle adding a Pokémon to a selected team
    const handleAddToTeam = async (pokemon, teamId) => {

        // Find the team by teamId
        console.log(teams);
        const selectedTeam = teams.find((team) => team.teamId === teamId);

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


        // Send the updated team to the backend via a PUT request
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

            // Update the frontend state to reflect the changes
            setTeams(prevTeams => 
                prevTeams.map(team =>
                    team.teamId === teamId ? updatedTeamData : team
                )
            );

            alert(`${pokemon.name} added to team!`);
        } catch (error) {
            console.error("Error adding Pokémon to team:", error);
            alert("Failed to add Pokémon to the team.");
        }
    };

    return (
        <div className="container">
            {/* Filter Bar */}
            <div className="my-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Pokémon by name..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
            </div>

            <h1 className="text-center my-5">Kanto Pokémon</h1>

            <div className="row">
                {filteredPokedex.map((pokemon, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card">
                            <img
                                src={pokemon.sprites.other['official-artwork'].front_default}
                                className="card-img-top"
                                alt={pokemon.name}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{pokemon.name}</h5>
                                <p className="card-text">
                                    <strong>Type:</strong> {pokemon.types.join(", ")}
                                </p>
                                <p className="card-text">
                                    <strong>Height:</strong> {pokemon.height} decimeters
                                </p>
                                <p className="card-text">
                                    <strong>Weight:</strong> {pokemon.weight} hectograms
                                </p>

                                {/* Dropdown button to add to team */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" id={`dropdown-${pokemon.name}`}>
                                        Add to Team
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {teams.map((team) => (
                                            <Dropdown.Item
                                                key={team.teamId}
                                                onClick={() => handleAddToTeam(pokemon, team.teamId)}
                                            >
                                                {team.teamName}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pokedex;
