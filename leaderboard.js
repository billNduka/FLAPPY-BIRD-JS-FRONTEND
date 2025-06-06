const leaderboardTable = document.getElementById("leaderboard");

viewUrl = "http://localhost:8000/api/leaderboard/view";


function addEntry(name, score){
    let row = document.createElement("tr");
    let rankCell = document.createElement("td");
    let nameCell = document.createElement("td");
    let scoreCell = document.createElement("td");
    rankCell.textContent = leaderboardTable.rows.length;
    nameCell.textContent = name;
    scoreCell.textContent = score;
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    leaderboardTable.appendChild(row);
}

function getScores(){
    fetch("http://localhost:8000/api/leaderboard/view").then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
  }).then(scores => {
        scores.forEach(score => {
            addEntry(score.username, score.score);
    });
  }).catch(error => {
        console.error('Error:', error);
  });
}



getScores();