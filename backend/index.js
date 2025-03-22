import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import fs from "fs";
import moment from "moment-timezone";
import express from "express";
import cors from "cors"; // Importing cors
import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAWMN1uEa2Bq9miiIDYitGHmVXG-DiXXaM",
  authDomain: "agroturbox.firebaseapp.com",
  projectId: "agroturbox",
  storageBucket: "agroturbox.appspot.com",
  messagingSenderId: "200490639266",
  appId: "1:200490639266:web:ef247d507698ab87ec1cfb",
  measurementId: "G-YGHK4W0748",
  databaseURL: "https://agroturbox-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase initialized successfully!");

// Initialize Express
const server = express();
const port = 5010;

// Use CORS middleware to allow cross-origin requests
server.use(cors()); // This will allow all origins by default

// Middleware to handle JSON requests
server.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a WhatsApp bulk message with weather details
async function getCompletion(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching completion:", error);
    return "Sorry, I couldn't generate the message.";
  }
}

// Function to fetch and store data
const fetchAndStoreData = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "/")); // Fetch root data

    if (snapshot.exists()) {
      // Get data from the snapshot
      const data = snapshot.val();

      // Get the current timestamp in Sri Lanka time
      const sriLankanTime = moment()
        .tz("Asia/Colombo")
        .format("YYYY-MM-DD HH:mm:ss");

      // Prepare the data with timestamp
      const dataWithTimestamp = {
        timestamp: sriLankanTime,
        data: data,
      };

      // Read the existing data from the file, if any
      let storedData = [];
      if (fs.existsSync("data.json")) {
        const fileData = fs.readFileSync("data.json", "utf8");
        storedData = JSON.parse(fileData);
      }

      // Add the new data entry to the array
      storedData.push(dataWithTimestamp);

      // Ensure the array does not exceed 100 entries
      if (storedData.length > 50) {
        storedData.shift(); // Remove the oldest entry
      }

      // Write the updated data to the local JSON file
      fs.writeFileSync("data.json", JSON.stringify(storedData, null, 2));

      console.log(`Data fetched and saved at ${sriLankanTime}`);
    } else {
      console.log("No data found in the database.");
    }
  } catch (error) {
    console.error("Error fetching and storing data:", error);
  }
};

// Call fetchAndStoreData every 1 minute (60000 ms)
setInterval(fetchAndStoreData, 60000);

// Call once to initialize
fetchAndStoreData();

// New API to return data from data.json
server.get("/api/data", (req, res) => {
  try {
    if (fs.existsSync("data.json")) {
      const fileData = fs.readFileSync("data.json", "utf8");
      const storedData = JSON.parse(fileData);
      res.json(storedData); // Return data as JSON
    } else {
      res.status(404).json({ error: "Data not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error reading data file." });
  }
});

server.get("/api/data/last", (req, res) => {
  try {
    if (fs.existsSync("data.json")) {
      const fileData = fs.readFileSync("data.json", "utf8");
      const storedData = JSON.parse(fileData);

      if (storedData.length === 0) {
        return res.status(404).json({ error: "No data available." });
      }

      // Get the last entry
      const lastEntry = storedData[storedData.length - 1];

      res.json(lastEntry); // Return only the last JSON entry
    } else {
      res.status(404).json({ error: "Data file not found." });
    }
  } catch (error) {
    console.error("Error reading data file:", error);
    res.status(500).json({ error: "Error reading data file." });
  }
});

// New API to add points to devices.json
server.post("/api/add-point", (req, res) => {
  const newPoint = req.body;
  if (!newPoint) {
    return res.status(400).json({ error: "No data provided." });
  }

  try {
    let devices = [];
    if (fs.existsSync("devices.json")) {
      const fileData = fs.readFileSync("devices.json", "utf8");
      devices = JSON.parse(fileData);
    }

    // Add new point to devices.json
    devices.push(newPoint);

    // Write the updated data to the file
    fs.writeFileSync("devices.json", JSON.stringify(devices, null, 2));
    res.status(200).json({ message: "Point added successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error saving point." });
  }
});

const API_KEY =
  process.env.WEATHER_API_KEY || "142b0097648d4f5c92c164827252702"; // Set your API key here
const BASE_URL = "http://api.weatherapi.com/v1/current.json";

// Weather API + OpenAI Integration
server.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city || "Chilaw"; // Default to Colombo

    if (!API_KEY || API_KEY === "your_actual_api_key_here") {
      return res
        .status(500)
        .json({ error: "Missing or invalid Weather API key" });
    }

    // Fetch weather data
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${city}&aqi=no`
    );
    const weatherData = response.data;

    // Extract necessary weather details
    const { name, country } = weatherData.location;
    const { temp_c, condition } = weatherData.current;

    // Prepare prompt for OpenAI
    const prompt = ` ${name}, ${country}. temperature is ${temp_c}°C and the condition is ${condition.text}. With the content, create a predition of  weather in next 7 days in a summery in 200 chars? and provide me a day if rain will happen? and data for the soil moisture and raining in next week`;

    // Get AI-generated message
    const aiMessage = await getCompletion(prompt);

    // Send response
    res.json({
      location: { name, country },
      weather: { temp_c, condition: condition.text },
      assume: aiMessage,
      fullData: weatherData,
    });
  } catch (error) {
    console.error("Error fetching weather or AI response:", error);
    res.status(500).json({ error: "Error fetching weather or AI response" });
  }
});

// New API to get all points from devices.json
server.get("/api/points", (req, res) => {
  try {
    if (fs.existsSync("devices.json")) {
      const fileData = fs.readFileSync("devices.json", "utf8");
      const devices = JSON.parse(fileData);
      res.json(devices); // Return points as JSON
    } else {
      res.status(404).json({ error: "No devices found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error reading devices file." });
  }
});

server.get("/api/data/latest", (req, res) => {
  try {
    if (fs.existsSync("data.json")) {
      const fileData = fs.readFileSync("data.json", "utf8");
      const storedData = JSON.parse(fileData);

      // Get the last 20 entries
      const latestEntries = storedData.slice(-20).reverse(); // Reverse to show latest first

      res.json(latestEntries);
    } else {
      res.status(404).json({ error: "Data file not found." });
    }
  } catch (error) {
    console.error("Error reading data file:", error);
    res.status(500).json({ error: "Error reading data file." });
  }
});

// API to get weather for Colombo

// New API to delete points from devices.json
server.post("/api/delete-point", (req, res) => {
  const pointToDelete = req.body;
  if (!pointToDelete) {
    return res.status(400).json({ error: "No data provided." });
  }

  try {
    let devices = [];
    if (fs.existsSync("devices.json")) {
      const fileData = fs.readFileSync("devices.json", "utf8");
      devices = JSON.parse(fileData);
    }

    // Filter out the point to delete
    devices = devices.filter(
      (point) =>
        point.x !== pointToDelete.x ||
        point.y !== pointToDelete.y ||
        point.name !== pointToDelete.name
    );

    // Write the updated data to the file
    fs.writeFileSync("devices.json", JSON.stringify(devices, null, 2));
    res.status(200).json({ message: "Point deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting point." });
  }
});

// Start the Express server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
