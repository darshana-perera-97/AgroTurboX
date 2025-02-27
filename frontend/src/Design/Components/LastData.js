import React, { useState, useEffect } from "react";

const LastData = () => {
  const [data, setData] = useState(null); // State to store the data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/data/last");

      if (response.ok) {
        const result = await response.json();
        setData(result); // Set the fetched data to state
        setError(null); // Clear previous errors
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      setError(err.message); // Handle any error during the fetch
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount

    // Set interval to fetch data every 1 minute
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval); // Cleanup function to clear interval when component unmounts
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there's an issue
  }

  if (!data) {
    return <div>No data available.</div>; // Show message if no data is available
  }

  // Render the fetched data
  return (
    <div>
      <h2>Last Data Entry</h2>
      <p>
        <strong>Timestamp:</strong> {data.timestamp}
      </p>
      <div>
        <strong>Device Data:</strong>
        <pre>{JSON.stringify(data.data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default LastData;
