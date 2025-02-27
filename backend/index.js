import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import fs from "fs";
import moment from "moment-timezone";
import express from "express";
import cors from "cors"; // Importing cors

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
      if (storedData.length > 100) {
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
