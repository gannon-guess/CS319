import React from "react";
import ReactDOM from "react-dom/client";
import App from './Application.js';

// obtain the root
const root = ReactDOM.createRoot(document.getElementById("root"));

// render the application module
root.render(
    <div>
        {/* call the application module */}
        <App />
    </div>
);