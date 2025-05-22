import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";

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

const CandlesContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 100px;
  overflow: hidden;
  background-color: #000;
  
  @media (min-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const CandleImage = styled.div<{ opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.opacity};
  transition: opacity 1s ease-in-out;
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

interface LoadingCandlesProps {
  message?: string;
  subText?: string;
}

const LoadingCandles: React.FC<LoadingCandlesProps> = ({ 
  message = "Summoning mystical energies...",
  subText = "Please wait while we prepare your experience"
}) => {
  const [litOpacity, setLitOpacity] = useState(1);
  const [dots, setDots] = useState("...");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLitOpacity(prev => prev === 1 ? 0 : 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
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
      <CandlesContainer>
        <CandleImage opacity={0.5}>
          <Image 
            src="/images/candles-out.png" 
            alt="Unlit candles" 
            layout="fill" 
            objectFit="contain"
          />
        </CandleImage>
        <CandleImage opacity={litOpacity}>
          <Image 
            src="/images/candles-lit.png" 
            alt="Lit candles" 
            layout="fill" 
            objectFit="contain"
          />
        </CandleImage>
        <CandleImage opacity={litOpacity - 0.5}>
          <Image 
            src="/images/candles-lit.png" 
            alt="Lit candles" 
            layout="fill" 
            objectFit="contain"
          />
        </CandleImage>
      </CandlesContainer>
      
      <LoadingText>{baseMessage}{dots}</LoadingText>
      {subText && <SubText>{subText}</SubText>}
    </OverlayContainer>
  );
};

export default LoadingCandles;
