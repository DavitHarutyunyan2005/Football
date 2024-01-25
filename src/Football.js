import React, { useRef, useEffect, useState } from 'react';
import './football.css';
import Messi from './MessiScore';
import Ronaldo from './RonaldoScore';
import Timer from './timer';
import ballKick from './sounds/ballKick.mp3';


const FootballField = () => {

    const [initialdata, setdata] = useState(null);




    const canvasRef = useRef(null);

    const [goals, setGoals] = useState({
        firstPlayer: 0,
        secondPlayer: 0,
    });

    const [reset, setreset] = useState(null);

    const [count, setCount] = useState(5);





    useEffect(() => {

        const countdown = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        // Clear the interval when the countdown reaches 0
        if (count === -1) {
            clearInterval(countdown);
        }

        // Clean up the interval on component unmount
        return () => clearInterval(countdown);
    }, [count]);





    useEffect(() => {


        function play(){
            new Audio (ballKick).play();
        }


        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        let audioPlayed = false;

        const fieldImg = new Image();
        fieldImg.src = "https://img.freepik.com/premium-photo/green-soccer-field-football-field-top-view-with-realistic-grass-texture-realistic-football-pitch_167120-261.jpg";

        let ball = new Image();
        ball.onerror = (error) => {
            alert("Error loading ball image:", error);
        };

        ball.src = "https://freepngimg.com/thumb/football/1-football-ball-png-image-thumb.png";
        const Firstplayer = new Image();
        Firstplayer.src = "https://freepngimg.com/thumb/cristiano_ronaldo/21866-4-cristiano-ronaldo-transparent-thumb.png";

        const Secondplayer = new Image();
        Secondplayer.onerror = (error) => {
            alert("Error loading Secondplayer:", error);
        }
        Secondplayer.src = "https://freepngimg.com/thumb/lionel_messi/20097-7-lionel-messi-free-download-thumb.png";


        let data = {
            ball: {
                x: canvas.width / 2 - 12,
                y: canvas.height / 2 - 19,
                width: 30,
                height: 30,
                xDelta: 30,
                yDelta: 20,
                kicked: false,
            },
            Firstplayer: {
                goals: 0,
                x: 70,
                y: 190,
                width: 123,
                height: 240,
                xDelta: 0,
                yDelta: 0,
            },
            Secondplayer: {
                goals: 0,
                x: 990,
                y: 120,
                width: 123,
                height: 300,
                xDelta: 0,
                yDelta: 0,
            },

            firstGoal: {
                x: 42,
                y: 226,
                width: 1,
                height: 147,
                goal: false
            },

            secondGoal: {
                x: 1156,
                y: 226,
                width: 1,
                height: 147,
                goal: false
            },

            paused: false,
        };

        setdata(data);


        if (!data.paused) {
            data.ball.xDelta = 9;
            data.ball.yDelta = 9;
        } else if (data.paused) {
            data.ball.xDelta = 0;
            data.ball.yDelta = 0;
        }




        function intersect(rect1, rect2) {
            const x = Math.max(rect1.x, rect2.x),
                num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width),
                y = Math.max(rect1.y, rect2.y),
                num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
            return (num1 >= x && num2 >= y);
        };

        function reset() {
            data.ball.x = canvas.width / 2 - 12;
            data.ball.y = canvas.height / 2 - 19;
            data.Firstplayer.x = 70;
            data.Firstplayer.y = 170;
            data.Secondplayer.x = 990;
            data.Secondplayer.y = 190;
        }

        setreset(reset);

        function triggerGoalAnimation() {


            const canvasCenterX = canvas.width / 2;
            const canvasCenterY = canvas.height / 2;

            const goalElement = document.createElement('div');
            goalElement.innerText = 'Goal!';
            goalElement.id = 'goalAnimation';

            const goalElementX = canvasCenterX - goalElement.offsetWidth / 2;
            const goalElementY = canvasCenterY - goalElement.offsetHeight / 2;

            goalElement.style.left = `${goalElementX}px`;
            goalElement.style.top = `${goalElementY}px`;

            document.body.appendChild(goalElement);

            goalElement.style.animation = 'none';
            goalElement.style.animation = null;

            // Show and play the animation
            goalElement.style.display = 'block';
            setTimeout(() => {
                goalElement.style.display = 'none';
                document.body.removeChild(goalElement);
            }, 2000); 
        }




        function update() {


            //First player

            if (!data.paused) {
                data.Firstplayer.x += data.Firstplayer.xDelta;
                data.Firstplayer.y += data.Firstplayer.yDelta;

                data.Firstplayer.xDelta = 0;
                data.Firstplayer.yDelta = 0;


                //Second player

                data.Secondplayer.x += data.Secondplayer.xDelta;
                data.Secondplayer.y += data.Secondplayer.yDelta;

                data.Secondplayer.xDelta = 0;
                data.Secondplayer.yDelta = 0;



                data.ball.x += data.ball.xDelta;
                data.ball.y += data.ball.yDelta;

            }


            // Ball
            const theBallIsAtTheFeetOfTheFirstPlayer = data.ball.x > data.Firstplayer.x &&
                data.ball.x < data.Firstplayer.x + data.Firstplayer.width - 40 &&
                data.ball.y > data.Firstplayer.y &&
                data.ball.y < data.Firstplayer.y + data.Firstplayer.height;


            const theBallIsAtTheFeetOfTheSecondPlayer = data.ball.x > data.Secondplayer.x + 20 &&
                data.ball.x < data.Secondplayer.x + data.Secondplayer.width &&
                data.ball.y > data.Secondplayer.y &&
                data.ball.y < data.Secondplayer.y + data.Secondplayer.height;

            if (theBallIsAtTheFeetOfTheFirstPlayer && data.ball.kicked) {
        
                function decreasingLoop(startvalue, speed) {
                    let ballSpeed = startvalue;
                    function iteration() {
                        ballSpeed--;
                        data.ball.xDelta = ballSpeed;
                        if (ballSpeed > 0) {
                            setTimeout(iteration, speed);
                        }
                    }
                    // Start the loop
                    iteration();
                }
                decreasingLoop(4, 300);
            } else if (theBallIsAtTheFeetOfTheFirstPlayer) {
                function decreasingLoop(startvalue, speed) {
                    let ballSpeed = startvalue;
                    function iteration() {
                        // Decrease the value
                        ballSpeed--;
                        // alert(ballSpeed);
                        data.ball.xDelta = ballSpeed;
                        // data.ball.kicked = false;
                        // Check if the loop should continue
                        if (ballSpeed > 0) {
                            // Schedule the next iteration with a delay (speed in milliseconds)
                            setTimeout(iteration, speed);
                        }
                    }
                    iteration();
                }
                decreasingLoop(3, 300);
            }

            if (theBallIsAtTheFeetOfTheSecondPlayer && data.ball.kicked) {
                function decreasingLoop(startvalue, speed) {
                    let ballSpeed = startvalue;
                    function iteration() {
                        ballSpeed++;
                        data.ball.xDelta = ballSpeed;
                        if (ballSpeed < 0) {
                            setTimeout(iteration, speed);
                        }
                    }
                    iteration();
                }
                decreasingLoop(-4, 300);
            } else if (theBallIsAtTheFeetOfTheSecondPlayer) {
                function decreasingLoop(startvalue, speed) {
                    let ballSpeed = startvalue;
                    function iteration() {
                        // Decrease the value
                        ballSpeed++;
                        // alert(ballSpeed);
                        data.ball.xDelta = ballSpeed;
                        // data.ball.kicked = false;
                        // Check if the loop should continue
                        if (ballSpeed < 0) {
                            // Schedule the next iteration with a delay (speed in milliseconds)
                            setTimeout(iteration, speed);
                        }
                    }
                    iteration();
                }
                decreasingLoop(-3, 300);
            }


            // Check if both players are touching the ball
            const bothPlayersTouchingBall =
                theBallIsAtTheFeetOfTheFirstPlayer &&
                theBallIsAtTheFeetOfTheSecondPlayer

            // If both players are touching the ball, make the ball go up
            if (bothPlayersTouchingBall) {
                data.ball.yDelta = -5; 
                data.ball.xDelta = 0;
            }


            // Update the ball's position based on deltas
            data.ball.x += data.ball.xDelta;
            data.ball.y += data.ball.yDelta;

            if (data.ball.x + data.ball.width > canvas.width && !audioPlayed) {

            }
            else if (data.ball.x < 0 && !audioPlayed) {
                data.ball.xDelta = 5;
            }
            else if (data.ball.y + data.ball.height > canvas.height && !audioPlayed) {
                data.ball.yDelta = -5;
            } else if (data.ball.y < 0 && !audioPlayed) {
                data.ball.yDelta = 3;
                data.ball.xDelta = 3;

            }













            const kickFirstPlayer = data.ball.x > data.Firstplayer.x &&
                data.ball.x < data.Firstplayer.x + data.Firstplayer.width + 50 &&
                data.ball.y > data.Firstplayer.y &&
                data.ball.y < data.Firstplayer.y + data.Firstplayer.height;


            const kickSecondPlayer = data.ball.x > data.Secondplayer.x - 50 &&
                data.ball.x < data.Secondplayer.x + data.Secondplayer.width &&
                data.ball.y > data.Secondplayer.y &&
                data.ball.y < data.Secondplayer.y + data.Secondplayer.height;



            let readyToKickFirstPlayer;
            if (kickFirstPlayer && !data.paused) {
                readyToKickFirstPlayer = true;
                setTimeout(function () {
                    readyToKickFirstPlayer = false;
                }, 100);
            }

            let readyTokickSecondPlayer;
            if (kickSecondPlayer && !data.paused) {
                readyTokickSecondPlayer = true;
                setTimeout(function () {
                    readyTokickSecondPlayer = false;
                }, 100);
            }
        


            document.addEventListener("keydown", function (evt) {
                if (evt.code === "KeyF" && readyToKickFirstPlayer) {
                    play();
                    data.ball.kicked = true; 
                    data.ball.xDelta = 43;
                } else if (evt.code === "ShiftRight" && readyTokickSecondPlayer) {
                    play();
                    evt.preventDefault();
                    data.ball.kicked = true;
                    data.ball.xDelta = -43;
                }
            });


            if (data.ball.x + data.ball.width > canvas.width) { // In case the ball touches the right wall
                function decreasingLoop(startvalue, speed) {
                    let ballSpeed = startvalue;
                    function iteration() {
                        ballSpeed++;
                        data.ball.xDelta = ballSpeed;
                        if (ballSpeed < 0) {
                            setTimeout(iteration, speed);
                        }
                    }
                    iteration();
                }
                decreasingLoop(-4, 300);

            } else if (data.ball.x < 0) {  //In case the ball touches the left wall
                function decreasingLoop(startvalue, speed) {
                    let ballSpeed = startvalue;
                    function iteration() {
                        ballSpeed--;
                        data.ball.xDelta = ballSpeed;
                        if (ballSpeed > 0) {
                            setTimeout(iteration, speed);
                        }
                    }
                    iteration();
                }
                decreasingLoop(4, 300);

            }

            //When GOAL happens...


            let goalScore = false;

            let ballInFirstGoal = intersect(data.ball, data.firstGoal) && !goalScore;

            if (ballInFirstGoal) {
                goalScore = true;
                if (!data.paused) {
                    triggerGoalAnimation();

                }

                console.log('Goal scored by Lionel Messi!');
                setGoals((prevGoals) => ({ ...prevGoals, secondPlayer: prevGoals.secondPlayer + 1 })); // Update the state with the new goal count for the first player
                reset();
                setTimeout(function () {
                    goalScore = false;
                }, 1000);
            }


            const ballInSecondGoal = intersect(data.ball, data.secondGoal) && !goalScore;
            if (ballInSecondGoal) {
                goalScore = true;
                if (!data.paused) {
                    triggerGoalAnimation();
                }
                console.log('Goal scored by Cristiano Ronaldo!');
                setGoals((prevGoals) => ({ ...prevGoals, firstPlayer: prevGoals.firstPlayer + 1 }));
                reset();
                setTimeout(function () {
                    goalScore = false;
                }, 1000);
            }






        }


        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.drawImage(fieldImg, 0, 0, canvas.width, canvas.height);

            context.drawImage(ball, data.ball.x, data.ball.y, data.ball.width, data.ball.height);

            context.drawImage(Firstplayer, data.Firstplayer.x, data.Firstplayer.y, data.Firstplayer.width, data.Firstplayer.height);

            context.drawImage(Secondplayer, data.Secondplayer.x, data.Secondplayer.y, data.Secondplayer.width, data.Secondplayer.height)

            context.fillStyle = 'transparent'; 
            context.fillRect(data.firstGoal.x, data.firstGoal.y, data.firstGoal.width, data.firstGoal.height);

            context.fillStyle = 'transparent'; 
            context.fillRect(data.secondGoal.x, data.secondGoal.y, data.secondGoal.width, data.secondGoal.height);

        }



        Promise.all([fieldImg, ball, Firstplayer].map(img => new Promise(resolve => img.onload = resolve)))
            .then(() => {
                function loop() {
                    requestAnimationFrame(loop);
                    setTimeout(() => {
                        update();
                    }, 6000);

                    draw();
                }

                loop();
            });

        const keysPressed = {};

        document.addEventListener("keydown", function (evt) {
            keysPressed[evt.code] = true;

            handlePlayerMovement();
        });

        document.addEventListener("keyup", function (evt) {
            keysPressed[evt.code] = false;

            handlePlayerMovement();
        });

        // Handle player movement based on the keys pressed
        function handlePlayerMovement() {
            // Moving the First player...
            if (keysPressed["KeyD"] && !data.paused) {
                data.Firstplayer.xDelta = 21;
            } else if (keysPressed["KeyA"] && !data.paused) {
                data.Firstplayer.xDelta = -21;
            } else {
                data.Firstplayer.xDelta = 0;
            }

            if (keysPressed["KeyW"] && !data.paused) {
                data.Firstplayer.yDelta = -21;
            } else if (keysPressed["KeyS"] && !data.paused) {
                data.Firstplayer.yDelta = 21;
            } else {
                data.Firstplayer.yDelta = 0;
            }

            // Moving the Second player...
            if (keysPressed["ArrowRight"] && !data.paused) {
                data.Secondplayer.xDelta = 21;
            } else if (keysPressed["ArrowLeft"] && !data.paused) {
                data.Secondplayer.xDelta = -21;
            } else {
                data.Secondplayer.xDelta = 0;
            }

            if (keysPressed["ArrowUp"] && !data.paused) {
                data.Secondplayer.yDelta = -21;
            } else if (keysPressed["ArrowDown"] && !data.paused) {
                data.Secondplayer.yDelta = 21;
            } else {
                data.Secondplayer.yDelta = 0;
            }
        }







    }, []);



    return (


        <div className='Football'>
            <div className="row">
                <div className="item"> <Ronaldo goals={goals} /> </div>
                <div className="item"><div className="Timer"><Timer goals={goals} data={initialdata} reset={reset} /></div></div>
                <div className="item"><Messi goals={goals} /></div>
            </div>
            <div className="Start" style={{ display: count === -1 ? "none" : "block" }}>
                {count > 0 ? (
                    <div id="start">

                        <div className="left">
                            <img id='wasd' className='img' src="https://cdn-icons-png.flaticon.com/512/7177/7177433.png" alt="" />
                            <div className="f">
                                <p>kick</p>
                                <img id='f' className='img' src="https://cdn-icons-png.flaticon.com/128/10398/10398588.png" alt="" />

                            </div>
                        </div>

                        <div className="center">
                            <h1 className='count'>{count}</h1>
                        </div>

                        <div className="right">
                            <img id='arrows' className='img' src="https://cdn-icons-png.flaticon.com/128/8852/8852765.png" alt="" />

                            <div className="shift">
                                <p>kick</p>
                                <img id='shift' className='img' src="https://cdn-icons-png.flaticon.com/128/5518/5518072.png" alt="" />

                            </div>
                        </div>


                    </div>

                ) : (
                    <h1 style={{ color: 'white' }}>Start</h1>
                )}
            </div>

            <div className="row">
                <canvas ref={canvasRef} width={1200} height={600} />
            </div>
        </div>
    );
};

export default FootballField;


