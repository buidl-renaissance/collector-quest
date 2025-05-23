import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  gap: 2rem;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  
  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 4px solid rgba(187, 137, 48, 0.2);
  border-top: 4px solid #bb8930;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  color: #bb8930;
  font-size: 1.5rem;
  font-family: "Cinzel", serif;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
`;

const SubText = styled.div`
  color: #c7bfd4;
  font-size: 1rem;
  font-family: "Cormorant Garamond", serif;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
`;

interface LoadingBasicProps {
  message?: string;
  subText?: string;
}

const LoadingBasic: React.FC<LoadingBasicProps> = ({ 
  message = "Loading...",
  subText = "Please wait"
}) => {
  const [dots, setDots] = useState("...");
  
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === "") return ".";
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return "";
      });
    }, 500);
    
    return () => clearInterval(dotsInterval);
  }, []);
  
  // Remove dots from the original message if it ends with dots
  const baseMessage = message.endsWith("...") 
    ? message.slice(0, -3) 
    : message.endsWith("..")
      ? message.slice(0, -2)
      : message.endsWith(".")
        ? message.slice(0, -1)
        : message;
  
  return (
    <OverlayContainer>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      
      <LoadingText>{baseMessage}{dots}</LoadingText>
      {subText && <SubText>{subText}</SubText>}
    </OverlayContainer>
  );
};

export default LoadingBasic;
