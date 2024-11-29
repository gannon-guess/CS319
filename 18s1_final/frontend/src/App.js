import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import Pokedex from "./Pokedex.js"
import Teams from "./Teams.js"
import Authors from "./Authors.js"
import NavBar from "./NavBar.js"
import EditTeam from "./EditTeam.js";

function App() {
    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState([]);
    const [pokedex, setPokedex] = useState([]);

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


    return (
        
        <Router>
            <NavBar/>
            <div className="d-flex">
                
                <div className="flex-grow-1 p-3">
                    <Routes>
                        {/* <Route path="/" element={<div>Welcome to the Pokemon Team app!</div>} /> */}
                        <Route path="/pokedex" element={<Pokedex
                                    pokedex={ pokedex }
                                    setPokedex={ setPokedex }
                                    teams={teams}
                                    setTeams={setTeams}
                                />
                            } 
                        />
                        <Route path="/teams" element={
                                <Teams
                                    teams={teams}
                                    setTeams={setTeams}
                                />
                            }
                        />
                        <Route path="/authors" element={
                                <Authors/>
                            }
                        />
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