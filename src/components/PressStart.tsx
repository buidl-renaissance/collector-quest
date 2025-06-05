import React, { useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { useRouter } from "next/router";

interface PressStartProps {
  className?: string;
}

const PressStart: React.FC<PressStartProps> = ({ className }) => {
  const [isCreating, setIsCreating] = useState(false);
  const { createCharacter } = useCurrentCharacter();
  const router = useRouter();
  const handlePressStart = async () => {
    try {
      setIsCreating(true);
      await createCharacter();
      router.push("/character/name");
    } catch (err) {
      console.error("Error creating character:", err);
      setIsCreating(false);
    }
  };
  return (
    <VideoSection className={className}>
      <VideoContainer>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/COLLECTOR-quest-intro-placeholder.png"
        >
          <source
            src="/videos/COLLECTOR-quest-intro-compressed.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <VideoOverlay>
          <PlayButton onClick={handlePressStart} disabled={isCreating}>
            {isCreating ? <LoadingSpinner /> : <span>PRESS START</span>}
          </PlayButton>
        </VideoOverlay>
      </VideoContainer>
    </VideoSection>
  );
};

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 10px rgba(108, 73, 7, 0.5); }
  50% { text-shadow: 0 0 20px rgba(187, 137, 48, 0.8), 0 0 30px rgba(182, 85, 28, 0.6); }
  100% { text-shadow: 0 0 10px rgba(108, 73, 7, 0.5); }
`;

const VideoSection = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin-bottom: 2rem;
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: none;
  border: none;
  color: #bb8930;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${glow} 3s infinite ease-in-out;
  text-decoration: none;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    animation: none;

    &:hover {
      transform: translate(-50%, -50%);
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;

  &::after {
    content: "";
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid #bb8930;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

export default PressStart;
