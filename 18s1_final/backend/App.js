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
app.put('/teams/:id', async (req, res) => {
    const teamId = parseInt(req.params.id);
    const { pokemon } = req.body; // The new Pokémon data
    console.log("searching for: ", teamId);
    try {
        const team = await teamsCollection.findOne({ teamId });
        console.log("found to update:", team)

        if (team) {
            // Append the new Pokémon to the team's existing Pokémon array
            const updatedTeam = {
                ...team,
                pokemon: [...team.pokemon, ...pokemon] // Add new Pokémon to the existing array
            };

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