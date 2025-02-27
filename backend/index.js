import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import fs from "fs";
import moment from "moment-timezone";

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
