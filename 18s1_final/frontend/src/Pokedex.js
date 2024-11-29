import React, { useState, useEffect } from 'react';

function Pokedex({pokedex, setPokedex}) {
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
                return pokeData;
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
                console.log(pokedex);
            } catch (error) {
                alert("There was an Error loading pokemon " + error);
            }
        };
        fetchKantoPokemon();
    }, []);

    

    return(
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
                                src={pokemon.sprites.front_default}
                                className="card-img-top"
                                alt={pokemon.name}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{pokemon.name}</h5>
                                <p className="card-text">
                                    <strong>Type:</strong> {pokemon.types.map(type => type.type.name).join(", ")}
                                </p>
                                <p className="card-text">
                                    <strong>Height:</strong> {pokemon.height} decimeters
                                </p>
                                <p className="card-text">
                                    <strong>Weight:</strong> {pokemon.weight} hectograms
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pokedex;