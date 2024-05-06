
type MenuProps = {
    onStartGame: () => void;
};

const Menu = ({ onStartGame }: MenuProps) => {
    return (
        <div className="menu">
            <div className="card">
                <img src="src/assets/images/archer.gif" alt="Knight GIF" />
                <h1>Castle Defender</h1>
                <div>
                    <button onClick={onStartGame}>PLAY</button>
                </div>
                <p className="reference">For the best gaming experience, we recommend having the resolution scale set to 100% in the system (laptops have a default of 125%, in this case set the zoom scale in the browser to 80%)</p>
                <p className="reference">Graphic materials are from DELL-E 3 and Craftpix.net</p> 
            </div>
        </div>
    );
};

export default Menu;
