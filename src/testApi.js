// Replace with an actual organizer ID
const organizerId = "12345";
const apiUrl = `https://www.bilesuparadize.lv/api/organizer/${organizerId}/repertoire`;

// Fetch API Data
fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Log the data to the console
    console.log("Fetched Organizer Repertoire:", data);

    // Display data in a simple way on the page (for browser environment)
    const events = data
      .map(
        (event) => `
      <li>
        <strong>Event ID:</strong> ${event.id} <br/>
        <strong>Performance Title (EN):</strong> ${event.performance.titles.en} <br/>
        <strong>Date:</strong> ${event.dateTime}
      </li>
    `,
      )
      .join("");

    document.getElementById("events-list").innerHTML = `<ul>${events}</ul>`;
  })
  .catch((error) => {
    console.error("Failed to fetch the API:", error);
  });

// Adding some simple HTML to display the data (for browser environment)
document.body.innerHTML = `
  <h1>Organizer Repertoire</h1>
  <div id="events-list">
    <p>Loading events...</p>
  </div>
`;
