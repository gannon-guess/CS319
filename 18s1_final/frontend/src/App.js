import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import Pokedex from "./Pokedex.js"
import Teams from "./Teams.js"
import Authors from "./Authors.js"
import NavBar from "./NavBar.js"

function App() {
    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState([]);
    const [pokedex, setPokedex] = useState([]);

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
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
export default App;