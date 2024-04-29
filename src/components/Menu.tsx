import React from 'react';

type MenuProps = {
    onStartGame: () => void;
};

const Menu = ({ onStartGame }: MenuProps) => {
    return (
        <div className="menu">
            <div className="card">
                <img src="src/assets/images/archer.gif" alt="Knight GIF" />
                <h1>Castle Craft</h1>
                <div>
                    <button onClick={onStartGame}>PLAY</button>
                </div>
                <p className="author">Game by Jan Housa</p>
                <p className="reference">This is a remake of Age of War</p>
                <p className="reference">Graphic materials are from Dell-E 3 and Craftpix.net</p> 
            </div>
        </div>
    );
};

export default Menu;
