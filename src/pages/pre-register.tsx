import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Head from "next/head";
import PreRegister from "@/components/PreRegister";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(58, 38, 6, 0.9) 0%, rgba(108, 58, 20, 0.9) 50%, rgba(58, 38, 6, 0.9) 100%);
  color: #e6e6e6;
  position: relative;
  overflow: hidden;
  font-family: "EB Garamond", "Merriweather", serif;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/collector-quest-background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.25;
    z-index: 0;
  }
`;

const ParallaxBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/parchment-texture.jpg');
  background-size: cover;
  opacity: 0.05;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: "Cinzel Decorative", "Uncial Antiqua", serif;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.8s ease-out;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const MagicSpan = styled.span`
  background: linear-gradient(90deg, #bb8930, #b6551c, #bb8930);
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  font-weight: normal;
  margin-bottom: 1.5rem;
  color: #bb8930;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PreRegisterPage: React.FC = () => {
  return (
    <PageWrapper>
      <ParallaxBackground />
      <Container>
        <Head>
          <title>Pre-Register | Collector Quest</title>
        </Head>
        
        <Title><MagicSpan>Collector Quest</MagicSpan></Title>
        <Subtitle>Pre-register for early access to our adventure</Subtitle>
        
        <PreRegister />
      </Container>
    </PageWrapper>
  );
};

export default PreRegisterPage;
