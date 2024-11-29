var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: '1000mb' }));  // Increase the limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const port = "8081";
const host = "localhost";

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms3190";
const client = new MongoClient(url);
const db = client.db(dbName);


const teamsCollection = db.collection("pokemonTeams");
let teamId = 0;
// Set up multer for image upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Save images in the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });

// const upload = multer({ storage: storage });

// Create "uploads" folder if it doesn't exist
// const fs = require("fs");
// if (!fs.existsSync("uploads")) {
//     fs.mkdirSync("uploads");
// }
    
app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

// create an empty team
app.post('/teams', async (req, res) => {
    const { teamName } = req.body;

    // Check if team name is provided
    if (!teamName) {
        return res.status(400).json({ error: 'Team name is required' });
    }

    // Generate a new teamId (for example, using a random number or increment)
    const newTeam = {
        teamId,
        teamName: teamName,
        pokemon:[], // If no pokemon are passed, initialize as an empty array
    };
    teamId = teamId + 1;

    const result = await teamsCollection.insertOne(newTeam);

    // Send the newly created team back to the client
    res.status(201).json(newTeam);
});


// get all teams
app.get("/teams", async (req, res) => {
    try {
        const teams = await teamsCollection.find({}).toArray();
        res.status(200).json(teams);
    } catch (err) {
        res.status(500).json({ error: "Error fetching teams" });
    }
});

// get a team by id
app.get("/teams/:id", async (req, res) => {
    const teamId = parseInt(req.params.id); // Get the team ID from the URL
    try {
        const team = await teamsCollection.findOne({ teamId });
        if (team) {
            res.status(200).json(team);
        } else {
            res.status(404).json({ error: "Team not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error fetching team" });
    }
});

// put a pokemon to a team
app.put('/teams/add/:id', async (req, res) => {
    const teamId = parseInt(req.params.id);
    console.log("request:", req);
    const pokemon  = req.body; // The new Pokémon data
    console.log("searching for: ", teamId);
    try {
        const team = await teamsCollection.findOne({ teamId });
        console.log("adding:", pokemon)
        console.log("old team:", team)

        if (team) {
            // Append the new Pokémon to the team's existing Pokémon array

            // const newPokemonTeam = [
            //     ...pokemon,
            //     ...team.pokemon
            // ]
            const updatedTeam = {
                ...team, // Add new Pokémon to the existing array
                pokemon: [...team.pokemon, pokemon]
            };
            console.log("new:", updatedTeam);
            // Update the team in the database
            await teamsCollection.updateOne({ teamId }, { $set: updatedTeam });

            res.status(200).json(updatedTeam); // Send back the updated team
        } else {
            res.status(404).json({ error: "Team not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error updating team" });
    }
});

// edit a pokemon team's names
app.put('/teams/edit/:id', async (req, res) => {
    const teamId = parseInt(req.params.id);  // The team ID from the URL
    const { teamName } = req.body;  // The new team name from the request body

    if (!teamName) {
        return res.status(400).json({ error: "Team name is required" });
    }

    try {
        // Log for debugging
        console.log("Updating team with teamId:", teamId);
        console.log("New team name:", teamName);

        // Update the team name in the database based on the custom teamId
        const result = await teamsCollection.updateOne(
            { teamId: teamId },  // Find the team by its custom teamId
            { $set: { teamName } } // Set the new team name
        );

        // Check if the team was found and updated
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Team not found or name is unchanged" });
        }

        // Fetch the updated team
        const updatedTeam = await teamsCollection.findOne({ teamId: teamId });
        res.status(200).json(updatedTeam); // Return the updated team

    } catch (err) {
        console.error("Error updating team:", err);
        res.status(500).json({ error: "Error updating team" });
    }
});


// delete a pokemon team
app.delete('/teams/:id', async (req, res) => {
    const teamId = parseInt(req.params.id);
    try {
        const result = await teamsCollection.deleteOne({ teamId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Team not found" });
        }
        res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete team" });
    }
});

// Delete a Pokémon from a team's array by index
app.delete('/teams/remove-pokemon/:teamId', async (req, res) => {
    const { teamId } = req.params;  // The teamId from the URL
    const { index } = req.body;  // The index of the Pokémon to remove
    
    if (index === undefined || index < 0) {
        return res.status(400).json({ error: "Valid index is required" });
    }

    try {
        const team = await teamsCollection.findOne({ teamId: parseInt(teamId) });

        if (!team || !team.pokemon || team.pokemon.length <= index) {
            return res.status(404).json({ error: "Team or Pokémon not found" });
        }

        // Remove the Pokémon at the given index
        const updatedPokemonArray = [...team.pokemon];
        updatedPokemonArray.splice(index, 1);

        // Update the team with the new Pokémon array
        const result = await teamsCollection.updateOne(
            { teamId: parseInt(teamId) },
            { $set: { pokemon: updatedPokemonArray } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Failed to update team" });
        }

        res.status(200).json({ message: "Pokemon removed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error removing Pokémon from team" });
    }
});