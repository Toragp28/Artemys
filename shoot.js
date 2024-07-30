// script.js

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameScreen = document.getElementById('game-screen');
    const gameArea = document.querySelector('.game-area');
    const target = document.getElementById('target');
    const reactionTimeDisplay = document.getElementById('reaction-time');
    const pointsDisplay = document.getElementById('points');
    const gamesPlayedDisplay = document.getElementById('games-played');
    const totalScoreDisplay = document.getElementById('total-score');
    const rankDisplay = document.getElementById('rank');
    const timerDisplay = document.getElementById('timer');

    let startTime;
    let timer;
    let points = 0;
    let totalPoints = 0;
    let gamesPlayed = 0;
    let timeLeft = 45;
    let gameInterval;
    let roundInterval;
    let difficultyMultiplier = 1; // Variable pour augmenter la difficulté

    startButton.addEventListener('click', startGame);

    function startGame() {
        startButton.style.display = 'none';
        gameScreen.style.display = 'block';
        points = 0;
        timeLeft = 45;
        timerDisplay.textContent = timeLeft;
        pointsDisplay.textContent = points;
        gameInterval = setInterval(updateTimer, 1000);
        moveTarget();
    }

    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            endGame();
        }
    }

    function endGame() {
        gamesPlayed++;
        gamesPlayedDisplay.textContent = gamesPlayed;
        totalPoints += points;
        totalScoreDisplay.textContent = totalPoints;
        updateRank();
        difficultyMultiplier += 0.2; // Augmenter la difficulté à chaque partie
        if (gamesPlayed < 3) {
            startButton.style.display = 'block';
            startButton.textContent = 'Commencer la prochaine partie';
        } else {
            alert('Jeu terminé! Votre rang final est: ' + rankDisplay.textContent);
        }
    }

    function moveTarget() {
        const x = Math.random() * (gameArea.clientWidth - 50);
        const y = Math.random() * (gameArea.clientHeight - 50);
        const size = (Math.random() * 30 + 20) / difficultyMultiplier; // Réduire la taille en fonction de la difficulté
        const shapeType = Math.floor(Math.random() * 3);

        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
        target.style.width = `${size}px`;
        target.style.height = `${size}px`;

        // Réinitialiser les styles pour les différentes formes
        target.style.borderLeft = '';
        target.style.borderRight = '';
        target.style.borderBottom = '';
        target.style.backgroundColor = '';

        switch (shapeType) {
            case 0:
                target.style.borderRadius = '50%'; // cercle
                target.style.backgroundColor = 'red';
                break;
            case 1:
                target.style.borderRadius = '0'; // carré
                target.style.backgroundColor = 'blue';
                break;
            case 2:
                target.style.width = '0';
                target.style.height = '0';
                target.style.borderLeft = `${size / 2}px solid transparent`;
                target.style.borderRight = `${size / 2}px solid transparent`;
                target.style.borderBottom = `${size}px solid green`;
                break;
        }

        startTime = Date.now();
        target.addEventListener('click', handleTargetClick);
    }

    function handleTargetClick() {
        const endTime = Date.now();
        const reactionTime = endTime - startTime;
        reactionTimeDisplay.textContent = reactionTime;

        updateScore(reactionTime);

        target.removeEventListener('click', handleTargetClick);
        if (timeLeft > 0) {
            clearTimeout(roundInterval);
            roundInterval = setTimeout(moveTarget, 1000 / difficultyMultiplier); // Augmenter la vitesse en fonction de la difficulté
        }
    }

    function updateScore(reactionTime) {
        points += Math.max(1000 - reactionTime, 0);
        pointsDisplay.textContent = points;
    }

    function updateRank() {
        let rank;
        if (totalPoints < 3000) {
            rank = "Novice";
        } else if (totalPoints < 6000) {
            rank = "Fer";
        } else if (totalPoints < 9000) {
            rank = "Or";
        } else if (totalPoints < 12000) {
            rank = "Diamant";
        } else {
            rank = "Divin";
        }
        rankDisplay.textContent = rank;
    }
});




