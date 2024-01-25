import React from 'react';
import './Score.css';


export default function Ronaldo({ goals }) {

    //First Player
    const firstPlayerImg = new Image();
    firstPlayerImg.src = "https://phantom-marca.unidadeditorial.es/b4f44c3ca4f39afa16aff5a1f30253d2/resize/828/f/jpg/assets/multimedia/imagenes/2022/12/30/16724382318394.jpg";

    const firstPlayerImgStyle = {
        borderRadius: '10px', // You can adjust the value to control the border radius
        width: ''
    };



    const RonaldoGoal = Math.ceil(goals.firstPlayer / 2);


    return (
        <div className="Ronaldo">
            <p>Christiano Ronaldo</p>
            <div className="images">
                <img src={firstPlayerImg.src} alt="Christiano Ronaldo" style={firstPlayerImgStyle} />
            </div>
            <div className="points">
                {RonaldoGoal} {/* Display the first player's goals */}
            </div>
        </div>

    );



}
