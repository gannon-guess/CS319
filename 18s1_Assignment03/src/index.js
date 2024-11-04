import React from "react";
import ReactDOM from "react-dom/client";
import App from './Application.js';

// Gannon Guess
// gannon@iastate.edu
// Boudhayan Chakraborty
// bcb43@iastate.edu
// November 3, 2024

// obtain the root
const root = ReactDOM.createRoot(document.getElementById("root"));

// render the application module
root.render(
    <div>
        {/* call the application module */}
        <App />
    </div>
);