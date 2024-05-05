import React, { useEffect, useState, useRef } from 'react';
import playImage from '/src/assets/images/sound_on.png'; 
import pauseImage from '/src/assets/images/sound_off.png';

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    await audioRef.current.play();
                } catch (err) {
                    console.log("Nepodařilo se automaticky spustit: ", err);
                    setIsPlaying(false);
                }
            }
        };

        playAudio();
    }, []);

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
            <audio ref={audioRef} src="./src/assets/music/theme.mp3" />
        </div>
    );
};

export default MusicPlayer;
