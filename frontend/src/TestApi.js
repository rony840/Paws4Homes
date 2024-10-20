import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestApi = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/test/'); // Ensure the URL matches your Django route
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setData(null);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Test API Response</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Displays the fetched data in a formatted way
      ) : (
        <p>No data fetched</p>
      )}
    </div>
  );
};

export default TestApi;
