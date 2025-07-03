import fetch from 'node-fetch';

(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/disaster-data/events');
    const data = await response.json();
    const disasterTypes = [...new Set(data.map((event) => event.disaster_type))];
    console.log('Unique Disaster Types:', disasterTypes);
  } catch (error) {
    console.error('Error fetching disaster data:', error);
  }
})();