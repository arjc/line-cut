document.addEventListener("DOMContentLoaded", () => {
    favIkkaOnPewer(candyColors[Math.floor(Math.random() * candyColors.length)]);
});

function favIkkaOnPewer(favImg) {
    let setFavicon = document.createElement('link');
    setFavicon.setAttribute('rel', 'shortcut icon');
    setFavicon.setAttribute('href', favImg);
    document.querySelector('head').appendChild(setFavicon);
}


function jibesh() {
    document.querySelector(".start").style.display = "none";
    suraSugarBlast();
}

function suraSugarBlast() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const highScoreDisplay = document.getElementById("highScore");
    const width = 8;
    const squares = [];
    let score = 0;
    let highScore = parseInt(localStorage.getItem("sugarBlastHighScore")) || 0;
    let timeRemaining = 60;
    let timerInterval = null;
    let gameActive = true;

    if (highScoreDisplay) {
        highScoreDisplay.textContent = highScore;
    }

    function playMatchSound(colorIndex) {
        try {
            const audio = new Audio(candySounds[colorIndex]);
            audio.play().catch(() => { });
        } catch (e) { }
    }

    function triggerVibration() { navigator.vibrate?.(50); }

    const matchedElements = new Set();
    let isGameBusy = false;

    function getGameOverMessage(score) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("sugarBlastHighScore", highScore);
        }
        if (typeof themeRank !== 'undefined' && themeRank) {
            const scoreData = themeRank.find(s => score <= s.max);
            return `=Your score: ${score} [best: ${highScore}]=\n---Which suggests that you are...\n---${scoreData?.msg}`;
        }
        return `Score: ${score}`;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;
            timeRemaining <= 10 ? timerDisplay.classList.add("time-warning") : timerDisplay.classList.remove("time-warning");

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                gameActive = false;
                isGameBusy = true;
                const message = getGameOverMessage(score);
                alert(`Game Over!\n${message}`);
                location.reload();
            }
        }, 1000);
    }

    // function resetGame() {
    //     timeRemaining = 60;
    //     score = 0;
    //     scoreDisplay.innerHTML = score;
    //     timerDisplay.textContent = timeRemaining;
    //     timerDisplay.classList.remove("time-warning");
    //     matchedElements.clear();
    //     squares.forEach(sq => sq.classList.remove("matched"));
    //     gameActive = true;
    //     isGameBusy = false;
    //     grid.innerHTML = "";
    //     squares.length = 0;
    //     createBoard();
    //     startTimer();
    // }

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = `url(${candyColors[randomColor]})`;
            square.setAttribute("data-color", randomColor);
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();
    startTimer();

    let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced, colorIndexBeingDragged, colorIndexBeingReplaced;

    squares.forEach(sq => sq.addEventListener("dragstart", dragStart));
    squares.forEach(sq => sq.addEventListener("dragend", dragEnd));
    squares.forEach(sq => sq.addEventListener("dragover", dragOver));
    squares.forEach(sq => sq.addEventListener("dragenter", dragEnter));
    squares.forEach(sq => sq.addEventListener("drageleave", dragLeave));
    squares.forEach(sq => sq.addEventListener("drop", dragDrop));
    squares.forEach(sq => sq.addEventListener("touchstart", touchStart));
    squares.forEach(sq => sq.addEventListener("touchend", touchEnd));
    squares.forEach(sq => sq.addEventListener("touchmove", touchMove));

    // Mouse ======================================================
    function dragStart() {
        if (isGameBusy || !gameActive) return;
        colorBeingDragged = this.style.backgroundImage;
        colorIndexBeingDragged = parseInt(this.getAttribute("data-color"));
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) {
        if (isGameBusy || !gameActive) return;
        e.preventDefault();
    }

    function dragEnter(e) {
        if (isGameBusy || !gameActive) return;
        e.preventDefault();
    }

    function dragLeave() {
        if (isGameBusy || !gameActive) return;
        this.style.backgroundImage = "";
    }

    function dragDrop() {
        if (isGameBusy || !gameActive) return;
        colorBeingReplaced = this.style.backgroundImage;
        colorIndexBeingReplaced = parseInt(this.getAttribute("data-color"));
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        this.setAttribute("data-color", colorIndexBeingDragged);
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
        squares[squareIdBeingDragged].setAttribute("data-color", colorIndexBeingReplaced);
    }

    function dragEnd() {
        if (isGameBusy || !gameActive) return;
        let validMoves = [squareIdBeingDragged - 1, squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    // touch screeen =======================================
    let touchStartId = null, touchStartX = 0, touchStartY = 0;

    function touchStart(e) {
        if (isGameBusy || !gameActive) return;
        touchStartId = parseInt(this.id);
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        colorBeingDragged = squares[touchStartId].style.backgroundImage;
        colorIndexBeingDragged = parseInt(squares[touchStartId].getAttribute("data-color"));
        squareIdBeingDragged = touchStartId;
    }

    function touchMove(e) {
        if (isGameBusy || !gameActive) return;
        e.preventDefault();
    }

    function touchEnd(e) {
        if (isGameBusy || !gameActive || touchStartId === null) return;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const threshold = 30;
        let swappedId = null;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
            swappedId = deltaX > 0 ? touchStartId + 1 : touchStartId - 1;
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
            swappedId = deltaY > 0 ? touchStartId + width : touchStartId - width;
        }

        if (swappedId !== null && swappedId >= 0 && swappedId < squares.length) {
            colorBeingReplaced = squares[swappedId].style.backgroundImage;
            colorIndexBeingReplaced = parseInt(squares[swappedId].getAttribute("data-color"));
            squares[swappedId].style.backgroundImage = colorBeingDragged;
            squares[swappedId].setAttribute("data-color", colorIndexBeingDragged);
            squares[touchStartId].style.backgroundImage = colorBeingReplaced;
            squares[touchStartId].setAttribute("data-color", colorIndexBeingReplaced);
        }
        touchStartId = null;
    }

    function moveIntoSquareBelow() {
        for (let col = 0; col < width; col++) {
            setTimeout(() => {
                const items = [];
                for (let row = 0; row < width; row++) {
                    const index = row * width + col;
                    if (squares[index].style.backgroundImage !== "") {
                        items.push({
                            image: squares[index].style.backgroundImage,
                            color: squares[index].getAttribute("data-color")
                        });
                    }
                }
                for (let row = 0; row < width; row++) {
                    const index = row * width + col;
                    squares[index].style.backgroundImage = "";
                    squares[index].setAttribute("data-color", "");
                }
                let fillIndex = width - 1;
                for (let i = items.length - 1; i >= 0; i--) {
                    const index = fillIndex * width + col;
                    squares[index].style.backgroundImage = items[i].image;
                    squares[index].setAttribute("data-color", items[i].color);
                    fillIndex--;
                }
                for (let row = 0; row < fillIndex + 1; row++) {
                    const index = row * width + col;
                    let randomColor = Math.floor(Math.random() * candyColors.length);
                    squares[index].style.backgroundImage = `url(${candyColors[randomColor]})`;
                    squares[index].setAttribute("data-color", randomColor);
                }
            }, col * 50);
        }
    }

    // ===

    function handleMatch(matches, points) {
        if (!matches.some(index => matchedElements.has(index))) {
            isGameBusy = true;
            score += points;
            scoreDisplay.innerHTML = score;
            const colorIndex = parseInt(squares[matches[0]].getAttribute("data-color"));
            playMatchSound(colorIndex);
            triggerVibration();
            matches.forEach(index => {
                squares[index].classList.add("matched");
                matchedElements.add(index);
            });
            setTimeout(() => {
                matches.forEach(index => {
                    squares[index].style.backgroundImage = "";
                    squares[index].classList.remove("matched");
                    matchedElements.delete(index);
                });
                isGameBusy = false;
            }, 600);
            return true;
        }
        return false;
    }

    // ===
    function checkMatches(maxLength) {
        const checkType = (indices, length) => {
            const decidedColor = squares[indices[0]].style.backgroundImage;
            return decidedColor !== "" && indices.every(i => squares[i].style.backgroundImage === decidedColor);
        };

        return (startIndex, increment, maxIndex, notValid) => {
            if (notValid && notValid.includes(startIndex)) return;
            const matches = [];
            for (let i = 0; i < maxLength; i++) {
                matches.push(startIndex + i * increment);
            }
            if (checkType(matches)) handleMatch(matches, maxLength);
        };
    }

    // ==========================================MATCH LOOP==========================================

    const checkRowFunc = checkMatches(3);
    const checkColFunc = checkMatches(3);

    function checkRowForFive() {
        const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29,
            30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52,
            53, 54, 55, 60, 61, 62, 63];
        for (let i = 0; i < 60; i++) {
            if (notValid.includes(i)) continue;
            const matches = [i, i + 1, i + 2, i + 3, i + 4];
            const decidedColor = squares[i].style.backgroundImage;
            if (decidedColor !== "" && matches.every(idx => squares[idx].style.backgroundImage === decidedColor)) {
                handleMatch(matches, 5);
            }
        }
    }

    function checkColumnForFive() {
        for (let i = 0; i < 35; i++) {
            const matches = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
            const decidedColor = squares[i].style.backgroundImage;
            if (decidedColor !== "" && matches.every(idx => squares[idx].style.backgroundImage === decidedColor)) {
                handleMatch(matches, 5);
            }
        }
    }

    function checkRowForFour() {
        const notValid = [5, 6, 7, 13, 14, 15, 21, 22,
            23, 29, 30, 31, 37, 38, 39, 45,
            46, 47, 53, 54, 55, 61, 62, 63];
        for (let i = 0; i < 61; i++) {
            if (notValid.includes(i)) continue;
            const matches = [i, i + 1, i + 2, i + 3];
            const decidedColor = squares[i].style.backgroundImage;
            if (decidedColor !== "" && matches.every(idx => squares[idx].style.backgroundImage === decidedColor)) {
                handleMatch(matches, 4);
            }
        }
    }

    function checkColumnForFour() {
        for (let i = 0; i < 40; i++) {
            const matches = [i, i + width, i + width * 2, i + width * 3];
            const decidedColor = squares[i].style.backgroundImage;
            if (decidedColor !== "" && matches.every(idx => squares[idx].style.backgroundImage === decidedColor)) {
                handleMatch(matches, 4);
            }
        }
    }

    function checkRowForThree() {
        const notValid = [6, 7, 14, 15, 22, 23, 30,
            31, 38, 39, 46, 47, 54, 55, 62, 63];
        for (let i = 0; i < 62; i++) {
            if (notValid.includes(i)) continue;
            const matches = [i, i + 1, i + 2];
            const decidedColor = squares[i].style.backgroundImage;
            if (decidedColor !== "" && matches.every(idx => squares[idx].style.backgroundImage === decidedColor)) {
                handleMatch(matches, 3);
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 48; i++) {
            const matches = [i, i + width, i + width * 2];
            const decidedColor = squares[i].style.backgroundImage;
            if (decidedColor !== "" && matches.every(idx => squares[idx].style.backgroundImage === decidedColor)) {
                handleMatch(matches, 3);
            }
        }
    }

    // let isSnowing = true;
    // ==================== SNOW ====================

    // function initSnowEffect() {
    //     const canvas = document.createElement('canvas');
    //     canvas.id = 'snowCanvas';
    //     canvas.style.position = 'fixed';
    //     canvas.style.top = '0';
    //     canvas.style.left = '0';
    //     canvas.style.width = '100%';
    //     canvas.style.height = '100%';
    //     canvas.style.pointerEvents = 'none';
    //     canvas.style.zIndex = '99999';
    //     document.body.appendChild(canvas);

    //     const ctx = canvas.getContext('2d');
    //     let snowflakes = [];
    //     let animationId;

    //     function resizeCanvas() {
    //         canvas.width = window.innerWidth;
    //         canvas.height = window.innerHeight;
    //     }

    //     class Snowflake {
    //         constructor() {
    //             this.x = Math.random() * canvas.width;
    //             this.y = Math.random() * canvas.height - canvas.height;
    //             this.radius = Math.random() * 3 + 1;
    //             this.speed = Math.random() * 1 + 0.5;
    //             this.wind = Math.random() * 0.5 - 0.25;
    //             this.opacity = Math.random() * 0.6 + 0.4;
    //         }

    //         update() {
    //             this.y += this.speed;
    //             this.x += this.wind;

    //             if (this.y > canvas.height) {
    //                 this.y = -10;
    //                 this.x = Math.random() * canvas.width;
    //             }

    //             if (this.x > canvas.width) {
    //                 this.x = 0;
    //             } else if (this.x < 0) {
    //                 this.x = canvas.width;
    //             }
    //         }

    //         draw() {
    //             ctx.beginPath();
    //             ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    //             ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    //             // ctx.fillStyle = `#fff`;
    //             ctx.fill();
    //             ctx.closePath();
    //         }
    //     }

    //     function createSnowflakes() {
    //         const numberOfFlakes = Math.floor((canvas.width * canvas.height) / 8000);
    //         snowflakes = [];
    //         for (let i = 0; i < numberOfFlakes; i++) {
    //             snowflakes.push(new Snowflake());
    //         }
    //     }

    //     function animate() {
    //         if (!isSnowing) {
    //             ctx.clearRect(0, 0, canvas.width, canvas.height);
    //             return;
    //         }

    //         ctx.clearRect(0, 0, canvas.width, canvas.height);

    //         snowflakes.forEach(flake => {
    //             flake.update();
    //             flake.draw();
    //         });

    //         animationId = requestAnimationFrame(animate);
    //     }

    //     resizeCanvas();
    //     createSnowflakes();
    //     animate();

    //     window.addEventListener('resize', () => {
    //         resizeCanvas();
    //         createSnowflakes();
    //     });

    //     const checkSnowStatus = setInterval(() => {
    //         if (isSnowing && !animationId) {
    //             animate();
    //         } else if (!isSnowing && animationId) {
    //             cancelAnimationFrame(animationId);
    //             animationId = null;
    //             ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         }
    //     }, 100);
    // }

    // // Initialize snow effect when DOM is ready
    // if (document.readyState === 'loading') {
    //     document.addEventListener('DOMContentLoaded', initSnowEffect);
    // } else {
    //     initSnowEffect();
    // }
    // ==================== END SNOW EFFECT ====================

    // GL =====================================================================
    setInterval(() => {
        // 5
        checkRowForFive();
        checkColumnForFive();
        // 4
        checkRowForFour();
        checkColumnForFour();
        // 3
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();


    }, 250);
}

