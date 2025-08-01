// Global variable to store all tournament stats
let tournamentStats = [];

// Load existing stats from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadStatsFromStorage();
    displayStats();
});

// Form submission handler
document.getElementById("statsForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData);
    
    // Add timestamp to the data
    formDataObject.timestamp = new Date().toLocaleString();
    
    // Add the new stats to our array
    tournamentStats.push(formDataObject);
    
    // Save to localStorage
    saveStatsToStorage();
    
    // Display updated stats
    displayStats();
    
    // Reset the form
    event.target.reset();
    
    console.log("New stats added:", formDataObject);
});

// Function to save stats to localStorage
function saveStatsToStorage() {
    localStorage.setItem('worldTourStats', JSON.stringify(tournamentStats));
}

// Function to load stats from localStorage
function loadStatsFromStorage() {
    const storedStats = localStorage.getItem('worldTourStats');
    if (storedStats) {
        tournamentStats = JSON.parse(storedStats);
    }
}

// Function to display stats in the session summary
function displayStats() {
    const summaryContainer = document.getElementById('sessionSummary');
    
    if (tournamentStats.length === 0) {
        summaryContainer.innerHTML = '<h2>Session Summary</h2><p>No stats recorded yet.</p>';
        return;
    }
    
    // Calculate summary statistics
    const totalGames = tournamentStats.length;
    const totalElims = tournamentStats.reduce((sum, stat) => sum + parseInt(stat.elims), 0);
    const totalAssists = tournamentStats.reduce((sum, stat) => sum + parseInt(stat.assists), 0);
    const totalDeaths = tournamentStats.reduce((sum, stat) => sum + parseInt(stat.deaths), 0);
    
    // Count placements
    const placementCounts = {};
    tournamentStats.forEach(stat => {
        placementCounts[stat.Placement] = (placementCounts[stat.Placement] || 0) + 1;
    });
    
    // Count class usage
    const classCounts = {};
    tournamentStats.forEach(stat => {
        classCounts[stat.Class] = (classCounts[stat.Class] || 0) + 1;
    });
    
    // Count map usage
    const mapCounts = {};
    tournamentStats.forEach(stat => {
        mapCounts[stat.Map] = (mapCounts[stat.Map] || 0) + 1;
    });
    
    // Create summary HTML
    let summaryHTML = `
        <h2>Session Summary</h2>
        <div class="summary-stats">
            <div class="summary-section">
                <h3>Overall Stats</h3>
                <p><strong>Total Games:</strong> ${totalGames}</p>
                <p><strong>Total Eliminations:</strong> ${totalElims}</p>
                <p><strong>Total Assists:</strong> ${totalAssists}</p>
                <p><strong>Total Deaths:</strong> ${totalDeaths}</p>
                <p><strong>KD:</strong> ${(totalElims / totalDeaths).toFixed(1)}</p>
                <p><strong>Average Eliminations:</strong> ${(totalElims / totalGames).toFixed(1)}</p>
                <p><strong>Average Assists:</strong> ${(totalAssists / totalGames).toFixed(1)}</p>
                <p><strong>Average Deaths:</strong> ${(totalDeaths / totalGames).toFixed(1)}</p>
            </div>
            
            <div class="summary-section">
                <h3>Placement Breakdown</h3>
                ${Object.entries(placementCounts).map(([placement, count]) => 
                    `<p><strong>${placement}:</strong> ${count} games</p>`
                ).join('')}
            </div>
            
            <div class="summary-section">
                <h3>Class Usage</h3>
                ${Object.entries(classCounts).map(([className, count]) => 
                    `<p><strong>${className}:</strong> ${count} games</p>`
                ).join('')}
            </div>
            
            <div class="summary-section">
                <h3>Map Usage</h3>
                ${Object.entries(mapCounts).map(([mapName, count]) => 
                    `<p><strong>${mapName}:</strong> ${count} games</p>`
                ).join('')}
            </div>
        </div>
        
        <div class="recent-games">
            <h3>Recent Games</h3>
            <div class="games-list">
                ${tournamentStats.slice(-5).reverse().map(stat => `
                    <div class="game-entry">
                        <div class="game-header">
                            <span class="map">${stat.Map}</span>
                            <span class="placement">${stat.Placement}</span>
                            <span class="class">${stat.Class}</span>
                        </div>
                        <div class="game-stats">
                            <span>Elims: ${stat.elims}</span>
                            <span>Assists: ${stat.assists}</span>
                            <span>Deaths: ${stat.deaths}</span>
                        </div>
                        <div class="game-time">${stat.timestamp}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <button onclick="clearStats()" class="clear-btn">Clear All Stats</button>
    `;
    
    summaryContainer.innerHTML = summaryHTML;
}

// Function to clear all stats
function clearStats() {
    if (confirm('Are you sure you want to clear all stats? This cannot be undone.')) {
        tournamentStats = [];
        localStorage.removeItem('worldTourStats');
        displayStats();
    }
}

// Export functions for potential external use
window.worldTourStats = {
    getStats: () => tournamentStats,
    clearStats: clearStats,
    addStats: (stats) => {
        tournamentStats.push(stats);
        saveStatsToStorage();
        displayStats();
    }
};
