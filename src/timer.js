import React, { useState, useEffect } from 'react';
import './timer.css';
import Crowd from './sounds/crowd.mp3';
import FootballWhistle from './sounds/whistle.mp3';


// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPause } from '@fortawesome/free-solid-svg-icons';

const Timer = ({ goals, data, reset, onRestart }) => {




    const MessiGoal = Math.ceil(goals.secondPlayer / 2);
    const RonaldoGoal = Math.ceil(goals.firstPlayer / 2);

    // Set initial time in seconds
    const initialTimeInSeconds = 35;
    const extraTimeInSeconds = 30; // 30 seconds
    const [timeInSeconds, setTimeInSeconds] = useState(initialTimeInSeconds);
    const [pausePlayText, setPausePlayText] = useState("Pause");
    const [isExtraTime, setIsExtraTime] = useState(false);




    // Check if the game is tied at the end
    const isTied = MessiGoal === RonaldoGoal;

    // Update the timer every second
    useEffect(() => {
        if (data && !data.paused) {
            const intervalId = setInterval(() => {
                // Update the time
                setTimeInSeconds(prevTime => prevTime - 1);
            }, 1000);

            // Clear the interval when time reaches zero
            if (timeInSeconds <= 0) {
                clearInterval(intervalId);

            }

            // Clear the interval when the component unmounts or when time reaches zero
            return () => {
                clearInterval(intervalId);
            };
        }
    },);

    // Pause function...
    function togglePause() {
        if (data) {
            data.paused = !data.paused; // Toggle the paused state
            // You may want to add additional logic here if needed
            if (!data.paused) {
                setPausePlayText("Pause");
                data.ball.xDelta = 9;
                data.ball.yDelta = 9;
            } else {
                setPausePlayText("Play");
                data.ball.xDelta = 0;
                data.ball.yDelta = 0;
            }
        }
    }

    // Format time into minutes and seconds
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    // Display the timer
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    let Winner;

    if (timeInSeconds <= 0) {
        if (isTied) {
            setIsExtraTime(true);
            // If the game is tied, add extra time
            setTimeInSeconds(extraTimeInSeconds);
        } else {
            // setIsExtraTime(false);
            data.paused = true;
            data.ball.xDelta = 0;
            data.ball.yDelta = 0;


            if (MessiGoal > RonaldoGoal) {
                Winner = "Messi Won!!";

            } else if (RonaldoGoal > MessiGoal) {
                Winner = "Ronaldo Won!!";
            }
        }
    }

    let pausebutton;
    if (
        pausePlayText === "pause"
    ) {
        pausebutton = new Image();
        pausebutton.src = "https://cdn-icons-png.flaticon.com/128/709/709691.png";

    } else if (pausePlayText === "play") {
        pausebutton = new Image();
        pausebutton.src = "https://cdn-icons-png.flaticon.com/128/727/727245.png";
    }



    function handleRestart() {
        window.location.reload();
        function Whistle(){
            
            new Audio (FootballWhistle).play();
        }

        function crowdNoise(){
            new Audio(Crowd).play();
        }
        setTimeout(function(){
            Whistle();
            crowdNoise();
        },6000);
    

    }

    let timerstyle;
    if (timeInSeconds <= 5) {
        timerstyle = "red";
    } else if (isExtraTime) {
        timerstyle = "yellow";
    } else {
        timerstyle = "green";
    }


    return (
        <div>
            <div className="board">
                <div className="timer" style={{ backgroundColor: timerstyle }}>
                    {formattedTime}
                </div>
                <div className="button" >
                    <button onClick={togglePause}>
                        {pausePlayText === 'Pause' ? (
                            <img src="https://cdn-icons-png.flaticon.com/128/709/709691.png" alt="Pause" />
                        ) : (
                            <img src="https://cdn-icons-png.flaticon.com/128/727/727245.png" alt="Play" />
                        )}
                    </button>

                </div>
            </div>

            <div className="Winner" style={{ display: timeInSeconds === 0 ? 'block' : 'none' }}>
                <img src="https://cdn-icons-png.flaticon.com/128/3176/3176355.png" alt="" />
                <h3>{Winner}</h3>
                <button onClick={handleRestart}>
                    <img src="https://cdn-icons-png.flaticon.com/128/102/102559.png" alt="Restart" />
                </button>
            </div>
        </div>
    );
};

export default Timer;
