import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = true,
  loop = true,
  muted = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(error => {
        console.error("Video playback failed:", error);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <VideoContainer>
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        onClick={togglePlayPause}
      />
      <VideoControls onClick={togglePlayPause}>
        {!isPlaying && <PlayButton>▶</PlayButton>}
      </VideoControls>
    </VideoContainer>
  );
};

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`;

const Video = styled.video`
  width: 100%;
  display: block;
  border-radius: 8px;
`;

const VideoControls = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const PlayButton = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  border: 2px solid #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
`;
