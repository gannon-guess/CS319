import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import Pokedex from "./Pokedex.js"

function App() {
    const [teams, setTeams] = useState([]);
    const [pokedex, setPokedex] = useState([]);

    return (
        <Router>
            <div className="d-flex">
                {/* <Sidebar /> */}
                <div className="flex-grow-1 p-3">
                    <h1 className="text-center">Pokemon Team App</h1>
                    <Routes>
                        <Route path="/" element={<div>Welcome to the Pokemon Team app!</div>} />
                        <Route path="/pokedex" element={<Pokedex
                            pokedex={pokedex}
                            setPokedex={setPokedex}
                        />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
export default App;