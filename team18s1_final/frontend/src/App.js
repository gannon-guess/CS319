/**
 * Gannon Guess
 * gannon@iastate.edu
 * Boudhayan Chakraborty
 * bcb43@iastate.edu
 * December 11, 2024
*/


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

// imports for all of the module pages
import Pokedex from "./Pokedex.js"
import Teams from "./Teams.js"
import Authors from "./Authors.js"
import NavBar from "./NavBar.js"
import EditTeam from "./EditTeam.js";

// Main module for handling what information is displayed at any given time
function App() {
    // used for storing all of the pokemon teams
    const [teams, setTeams] = useState([]);
    // used for storing pokemon in the pokedex
    const [pokedex, setPokedex] = useState([]);

    // the teams must from the DB and loaded so that the information
    // can be displayed when returning to the app
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

    // routes to the desired pages
    return (  
        <Router>
            {/* The nav bar is on every page */}
            <NavBar/>
            <div className="d-flex">
                
                <div className="flex-grow-1 p-3">
                    {/* Based on the current route, a different page will be displayed */}
                    <Routes>
                        {/* Pokedex page allowing users to add pokemon to their teams */}
                        <Route path="/pokedex" element={<Pokedex
                                    pokedex={ pokedex }
                                    setPokedex={ setPokedex }
                                    teams={teams}
                                    setTeams={setTeams}
                                />
                            } 
                        />
                        {/* Teams page allowing users to view start editing their teams */}
                        <Route path="/teams" element={
                                <Teams
                                    teams={teams}
                                    setTeams={setTeams}
                                />
                            }
                        />
                        {/* Author page that displays the creators of this app */}
                        <Route path="/authors" element={
                                <Authors/>
                            }
                        />
                        {/* Edit page that allows the user to edit teams */}
                        <Route path="/team/edit/:id" element={
                                <EditTeam/>
                            }
                        /> 
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
export default App;