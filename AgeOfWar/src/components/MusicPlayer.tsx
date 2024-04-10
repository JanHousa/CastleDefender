import React, { useState } from 'react';
import playImage from '/src/assets/images/sound_on.png'; // replace with your actual path
import pauseImage from '/src/assets/images/sound_off.png'; // replace with your actual path

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div>
            <img src={isPlaying ? pauseImage : playImage} onClick={togglePlay} alt={isPlaying ? 'Pause' : 'Play'} />
            <audio ref={audioRef} src="/src/assets/music/theme.mp3" />
        </div>
    );
};

export default MusicPlayer;