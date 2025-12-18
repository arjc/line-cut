document.addEventListener("DOMContentLoaded", () => {
    // Game doesn't start until user clicks start button
});

function jibesh() {
    // Hide start menu
    document.querySelector(".start").style.display = "none";
    // Start the game
    candyCrushGame();
}

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const width = 8;
    const squares = [];
    let score = 0;
    let timeRemaining = 60;
    let timerInterval = null;
    let gameActive = true;

    // Play match sound effect with candy-specific audio file
    function playMatchSound(colorIndex) {
        try {
            const audioFile = candySounds[colorIndex];
            if (audioFile) {
                const audio = new Audio(audioFile);
                audio.play().catch(() => {
                    // Silently fail if audio cannot be played
                });
            }
        } catch (e) {
            // Silently fail if audio cannot be created
        }
    }

    // Track matched elements to prevent duplicate deletions
    const matchedElements = new Set();

    // Track if game is busy (elements are animating)
    let isGameBusy = false;

    // Timer function
    function startTimer() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;

            // Add warning animation when time is low
            if (timeRemaining <= 10) {
                timerDisplay.classList.add("time-warning");
            } else {
                timerDisplay.classList.remove("time-warning");
            }

            // Timer reached 0
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                gameActive = false;
                isGameBusy = true;
                // Show final score alert
                const finalScore = score;
                if (score <= 5) {
                    var scoreMsg = "Andi pongathon";
                    playMatchSound(3);
                }
                if (score <= 15) {
                    var scoreMsg = "Kundan";
                    playMatchSound(3);
                }
                else if (score <= 25) {
                    var scoreMsg = "Kochukundan";
                    playMatchSound(4);
                }
                else if (score <= 35) {
                    var scoreMsg = "Pandi Karimpara Polayadi";
                    playMatchSound(2);
                }
                else if (score <= 45) {
                    var scoreMsg = "Polaydimon";
                    playMatchSound(0);
                }
                else if (score <= 55) {
                    var scoreMsg = "Nayinte patti mon";
                    playMatchSound(5);
                }
                else if (score <= 65) {
                    var scoreMsg = "Duplicate Indian Kazhuvarudamon";
                }
                else if (score <= 75) {
                    var scoreMsg = "Rajumon Puthiyamugauu *";
                }
                else if (score <= 85) {
                    var scoreMsg = "Moggerlal ⭐";
                }
                else if (score <= 95) {
                    var scoreMsg = "⭐ Convincing Suresh ⭐";
                }
                else if (score <= 105) {
                    var scoreMsg = "⭐⭐ STYLEN SURA ⭐⭐";
                }
                else if (score <= 115) {
                    var scoreMsg = "⭐⭐⭐ KOZHIKKODAN MOGGER ⭐⭐⭐";
                }
                else if (score <= 125) {
                    var scoreMsg = "⭐⭐⭐⭐ JAAARAN JIMBRUTTAN ⭐⭐⭐⭐ (top 1%)";
                }
                else {
                    var scoreMsg = "⭐⭐⭐⭐⭐ UNEMPLOYED UUMBAN ⭐⭐⭐⭐⭐ (POI PANI NOKK MYRE)";
                }
                
                alert(`Game Over!\nFinal Score: ${finalScore}.\n You are ${scoreMsg}`);

                // Reload the page
                location.reload();
            }
        }, 1000);
    }

    function resetGame() {
        // Reset timer and score
        timeRemaining = 60;
        score = 0;
        scoreDisplay.innerHTML = score;
        timerDisplay.textContent = timeRemaining;
        timerDisplay.classList.remove("time-warning");

        // Clear matched elements
        matchedElements.clear();
        squares.forEach(sq => {
            sq.classList.remove("matched");
        });

        // Reset game state
        gameActive = true;
        isGameBusy = false;

        // Recreate board
        grid.innerHTML = "";
        squares.length = 0;
        createBoard();

        // Restart timer
        startTimer();
    }

    // Creating Game Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);

            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            square.setAttribute("data-color", randomColor);
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    // Start the timer
    startTimer();

    // Dragging the Candy
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;
    let colorIndexBeingDragged;
    let colorIndexBeingReplaced;

    squares.forEach((square) =>
        square.addEventListener("dragstart", dragStart)
    );
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) =>
        square.addEventListener("dragenter", dragEnter)
    );
    squares.forEach((square) =>
        square.addEventListener("drageleave", dragLeave)
    );
    squares.forEach((square) => square.addEventListener("drop", dragDrop));

    // Touch support for mobile
    squares.forEach((square) =>
        square.addEventListener("touchstart", touchStart)
    );
    squares.forEach((square) =>
        square.addEventListener("touchend", touchEnd)
    );
    squares.forEach((square) =>
        square.addEventListener("touchmove", touchMove)
    );

    function dragStart() {
        if (isGameBusy || !gameActive) return;
        colorBeingDragged = this.style.backgroundImage;
        colorIndexBeingDragged = parseInt(this.getAttribute("data-color"));
        squareIdBeingDragged = parseInt(this.id);
        // this.style.backgroundImage = ''
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
        squares[
            squareIdBeingDragged
        ].style.backgroundImage = colorBeingReplaced;
        squares[squareIdBeingDragged].setAttribute("data-color", colorIndexBeingReplaced);
    }

    function dragEnd() {
        if (isGameBusy || !gameActive) return;
        //Defining, What is a valid move?
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[
                squareIdBeingReplaced
            ].style.backgroundImage = colorBeingReplaced;
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = colorBeingDragged;
        } else
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = colorBeingDragged;
    }

    // Touch event handlers for mobile
    let touchStartId = null;
    let touchStartX = 0;
    let touchStartY = 0;

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
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const threshold = 30;

        let swappedId = null;

        // Determine swipe direction (fixed: deltaX > 0 means swipe RIGHT, deltaY > 0 means swipe DOWN)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
            // Horizontal swipe
            if (deltaX > 0) {
                swappedId = touchStartId + 1; // Right swipe -> move right
            } else {
                swappedId = touchStartId - 1; // Left swipe -> move left
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
            // Vertical swipe
            if (deltaY > 0) {
                swappedId = touchStartId + width; // Down swipe -> move down
            } else {
                swappedId = touchStartId - width; // Up swipe -> move up
            }
        }

        if (swappedId !== null && swappedId >= 0 && swappedId < squares.length) {
            squareIdBeingReplaced = swappedId;
            colorBeingReplaced = squares[swappedId].style.backgroundImage;
            colorIndexBeingReplaced = parseInt(squares[swappedId].getAttribute("data-color"));

            // Perform swap
            squares[swappedId].style.backgroundImage = colorBeingDragged;
            squares[swappedId].setAttribute("data-color", colorIndexBeingDragged);
            squares[touchStartId].style.backgroundImage = colorBeingReplaced;
            squares[touchStartId].setAttribute("data-color", colorIndexBeingReplaced);

            squareIdBeingReplaced = null;
        }

        touchStartId = null;
    }

    //Dropping candies once some have been cleared - moves instantly
    function moveIntoSquareBelow() {
        // Process each column from left to right
        for (let col = 0; col < width; col++) {
            // Collect all non-empty items in the column
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

            // Clear the entire column
            for (let row = 0; row < width; row++) {
                const index = row * width + col;
                squares[index].style.backgroundImage = "";
                squares[index].setAttribute("data-color", "");
            }

            // Fill from bottom with items
            let fillIndex = width - 1;
            for (let i = items.length - 1; i >= 0; i--) {
                const index = fillIndex * width + col;
                squares[index].style.backgroundImage = items[i].image;
                squares[index].setAttribute("data-color", items[i].color);
                fillIndex--;
            }

            // Fill top rows with new random candies
            for (let row = 0; row < fillIndex + 1; row++) {
                const index = row * width + col;
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[index].style.backgroundImage = candyColors[randomColor];
                squares[index].setAttribute("data-color", randomColor);
            }
        }
    }

    ///-> Checking for Matches <-///

    //For Row of Four
    function checkRowForFour() {
        for (i = 0; i < 61; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                5,
                6,
                7,
                13,
                14,
                15,
                21,
                22,
                23,
                29,
                30,
                31,
                37,
                38,
                39,
                45,
                46,
                47,
                53,
                54,
                55,
                61,
                62,
                63
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                // Check if any element is already matched
                if (rowOfFour.some(index => matchedElements.has(index))) continue;

                isGameBusy = true;
                score += 4;
                scoreDisplay.innerHTML = score;
                const colorIndex = parseInt(squares[i].getAttribute("data-color"));
                playMatchSound(colorIndex);
                rowOfFour.forEach((index) => {
                    squares[index].classList.add("matched");
                    matchedElements.add(index);
                });
                setTimeout(() => {
                    rowOfFour.forEach((index) => {
                        squares[index].style.backgroundImage = "";
                        squares[index].classList.remove("matched");
                        matchedElements.delete(index);
                    });
                    isGameBusy = false;
                }, 600);
            }
        }
    }

    //For Column of Four
    function checkColumnForFour() {
        for (i = 0; i < 39; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                // Check if any element is already matched
                if (columnOfFour.some(index => matchedElements.has(index))) continue;

                isGameBusy = true;
                score += 4;
                scoreDisplay.innerHTML = score;
                const colorIndex = parseInt(squares[i].getAttribute("data-color"));
                playMatchSound(colorIndex);
                columnOfFour.forEach((index) => {
                    squares[index].classList.add("matched");
                    matchedElements.add(index);
                });
                setTimeout(() => {
                    columnOfFour.forEach((index) => {
                        squares[index].style.backgroundImage = "";
                        squares[index].classList.remove("matched");
                        matchedElements.delete(index);
                    });
                    isGameBusy = false;
                }, 600);
            }
        }
    }

    //For Row of Three
    function checkRowForThree() {
        for (i = 0; i < 62; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                6,
                7,
                14,
                15,
                22,
                23,
                30,
                31,
                38,
                39,
                46,
                47,
                54,
                55,
                62,
                63
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                // Check if any element is already matched
                if (rowOfThree.some(index => matchedElements.has(index))) continue;

                isGameBusy = true;
                score += 3;
                scoreDisplay.innerHTML = score;
                const colorIndex = parseInt(squares[i].getAttribute("data-color"));
                playMatchSound(colorIndex);
                rowOfThree.forEach((index) => {
                    squares[index].classList.add("matched");
                    matchedElements.add(index);
                });
                setTimeout(() => {
                    rowOfThree.forEach((index) => {
                        squares[index].style.backgroundImage = "";
                        squares[index].classList.remove("matched");
                        matchedElements.delete(index);
                    });
                    isGameBusy = false;
                }, 600);
            }
        }
    }

    //For Column of Three
    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                // Check if any element is already matched
                if (columnOfThree.some(index => matchedElements.has(index))) continue;

                isGameBusy = true;
                score += 3;
                scoreDisplay.innerHTML = score;
                const colorIndex = parseInt(squares[i].getAttribute("data-color"));
                playMatchSound(colorIndex);
                columnOfThree.forEach((index) => {
                    squares[index].classList.add("matched");
                    matchedElements.add(index);
                });
                setTimeout(() => {
                    columnOfThree.forEach((index) => {
                        squares[index].style.backgroundImage = "";
                        squares[index].classList.remove("matched");
                        matchedElements.delete(index);
                    });
                    isGameBusy = false;
                }, 600);
            }
        }
    }

    //For Row of Five
    function checkRowForFive() {
        for (i = 0; i < 60; i++) {
            let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                4,
                5,
                6,
                7,
                12,
                13,
                14,
                15,
                20,
                21,
                22,
                23,
                28,
                29,
                30,
                31,
                36,
                37,
                38,
                39,
                44,
                45,
                46,
                47,
                52,
                53,
                54,
                55,
                60,
                61,
                62,
                63
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfFive.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                // Check if any element is already matched
                if (rowOfFive.some(index => matchedElements.has(index))) continue;

                isGameBusy = true;
                score += 5;
                scoreDisplay.innerHTML = score;
                const colorIndex = parseInt(squares[i].getAttribute("data-color"));
                playMatchSound(colorIndex);
                rowOfFive.forEach((index) => {
                    squares[index].classList.add("matched");
                    matchedElements.add(index);
                });
                setTimeout(() => {
                    rowOfFive.forEach((index) => {
                        squares[index].style.backgroundImage = "";
                        squares[index].classList.remove("matched");
                        matchedElements.delete(index);
                    });
                    isGameBusy = false;
                }, 600);
            }
        }
    }

    //For Column of Five
    function checkColumnForFive() {
        for (i = 0; i < 35; i++) {
            let columnOfFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfFive.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                // Check if any element is already matched
                if (columnOfFive.some(index => matchedElements.has(index))) continue;

                isGameBusy = true;
                score += 5;
                scoreDisplay.innerHTML = score;
                const colorIndex = parseInt(squares[i].getAttribute("data-color"));
                playMatchSound(colorIndex);
                columnOfFive.forEach((index) => {
                    squares[index].classList.add("matched");
                    matchedElements.add(index);
                });
                setTimeout(() => {
                    columnOfFive.forEach((index) => {
                        squares[index].style.backgroundImage = "";
                        squares[index].classList.remove("matched");
                        matchedElements.delete(index);
                    });
                    isGameBusy = false;
                }, 600);
            }
        }
    }

    window.setInterval(function () {
        checkRowForFive();
        checkColumnForFive();
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }, 250);
}