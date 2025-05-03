import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import Head from 'next/head';
import { FaCrown, FaPalette, FaMusic, FaGem } from 'react-icons/fa';
import Events from '@/components/Events';

const EventsPage = () => {
  return (
    <Container>
      <Head>
        <title>Events | Lord Smearington&apos;s Realm</title>
        <meta name="description" content="Join us for upcoming events at Lord Smearington's Realm. Connect with our community both online and in-person." />
      </Head>
      
      <PageBackground />
      <CloakTexture />
      
      {[...Array(12)].map((_, i) => (
        <FloatingElement 
          key={i}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          size={`${Math.random() * 50 + 20}px`}
          animationDuration={`${Math.random() * 10 + 5}s`}
        >
          {getFloatingIcon(i)}
        </FloatingElement>
      ))}
      
      <Header>
        <CrownIcon />
        <HeaderTitle>UPCOMING EVENTS</HeaderTitle>
        <HeaderSubtitle>
          Connect with our community online and in-person
        </HeaderSubtitle>
      </Header>
      
      <ContentWrapper>
        <Events />
        
        <CTASection>
          <CTATitle>WANT TO COLLABORATE?</CTATitle>
          <CTAText>
            If you&apos;re interested in hosting an event with us or have ideas for collaboration,
            we&apos;d love to hear from you!
          </CTAText>
          <CTAButtons>
            <PrimaryButton href="/apply">Contact Us</PrimaryButton>
            <SecondaryButton href="https://discord.gg/kSuS9kdgTk" target="_blank">
              Join Discord
            </SecondaryButton>
          </CTAButtons>
        </CTASection>
      </ContentWrapper>
      
      <Footer>
        <FooterText>© 2023 Lord Smearington&apos;s Realm. All rights reserved.</FooterText>
        <FooterLinks>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/dnd">DnD Project</FooterLink>
          <FooterLink href="/apply">Join Us</FooterLink>
        </FooterLinks>
      </Footer>
    </Container>
  );
};

export default EventsPage;

// Animations
const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
  font-family: 'Cormorant Garamond', serif;
`;

const PageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #3B4C99, #5A3E85);
  z-index: -2;
`;

const CloakTexture = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23FFD700' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.5;
  z-index: -1;
`;

const getFloatingIcon = (index: number) => {
  switch(index % 4) {
    case 0: return <FaPalette />;
    case 1: return <FaMusic />;
    case 2: return <FaGem />;
    case 3: return <FaCrown />;
    default: return <FaPalette />;
  }
};

const FloatingElement = styled.div<{ size: string; top: string; left: string; animationDuration: string }>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
  color: rgba(255, 215, 0, 0.3);
  z-index: -1;
  animation: ${float} ${props => props.animationDuration} infinite ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(${props => props.size} * 0.6);
`;

const CrownIcon = styled(FaCrown)`
  font-size: 3rem;
  color: #FFD700;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
`;

const Header = styled.header`
  padding: 6rem 2rem 3rem;
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 3px;
    background: #FFD700;
    mask-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='%23FFD700' stroke-width='4' stroke-dasharray='6, 14' stroke-dashoffset='0' stroke-linecap='square'/%3E%3C/svg%3E");
  }
`;

const HeaderTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #FFD700, #FC67FA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Cinzel Decorative', serif;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #C7BFD4;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ContentWrapper = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 1s ease-out 0.2s both;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(59, 76, 153, 0.5), rgba(90, 62, 133, 0.5));
  border-radius: 8px;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
  font-family: 'Cinzel Decorative', serif;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FFD700, transparent);
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  color: #C7BFD4;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #F4C4F3, #FC67FA);
  color: #3B4C99;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #FFD700;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
    background: linear-gradient(135deg, #FC67FA, #F4C4F3);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background: transparent;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  border: 2px solid #FFD700;
  transition: all 0.3s ease;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
`;

const Footer = styled.footer`
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterText = styled.p`
  color: #C7BFD4;
  font-size: 0.9rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #C7BFD4;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #FFD700;
  }
`;
