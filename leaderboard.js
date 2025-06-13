const leaderboardTable = document.getElementById("leaderboard");

const viewUrl = "http://localhost:8000/api/leaderboard/view";


function addEntry(name, score){
    let row = document.createElement("tr");
    let rankCell = document.createElement("td");
    let nameCell = document.createElement("td");
    let scoreCell = document.createElement("td");
    let currentRank = leaderboardTable.rows.length
    rankCell.textContent = currentRank;
    nameCell.textContent = name.toUpperCase();
    scoreCell.textContent = score;
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);

    if(Number(currentRank) == 1) {
        row.classList.add("top1");
    } else if(Number(currentRank) <= 5){
        row.classList.add("top5");
    } else if(Number(currentRank) <= 10){
        row.classList.add("top10");
    } else if(Number(currentRank) <= 15){
        row.classList.add("top15");
    } else{
        row.classList.add("rest");
    }
    
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

function addScore(username, score) {
     fetch('http://localhost:8000/api/leaderboard/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, score })
    }).then(response => response.json()).then(data => alert(data.message))

}

getScores();

export { addScore };