import React from 'react';
import styled, { keyframes } from '@emotion/styled';
import Head from 'next/head';
import Link from 'next/link';

const DnDPage: React.FC = () => {
  return (
    <Container>
      <Head>
        <title>Join Lord Smearington&apos;s Realm | Build the Next-Gen DnD Experience</title>
        <meta name="description" content="Calling all builders, designers, and storytellers to join Lord Smearington&apos;s Realm and create the next generation of decentralized DnD gaming experiences." />
      </Head>

      <HeroSection>
        <HeroOverlay />
        <HeroContent>
          <Title>Lord Smearington&apos;s Realm</Title>
          <Subtitle>A Call to Arms for Builders & Creators</Subtitle>
          <Description>
            Join us in forging the next generation of decentralized tabletop gaming experiences
          </Description>
          <CTAButton href="#join-us">Join the Quest</CTAButton>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionTitle>The Vision</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🎲</FeatureIcon>
            <FeatureTitle>Decentralized Gaming</FeatureTitle>
            <FeatureDescription>
              Build a DnD experience where game assets, characters, and worlds are owned by players through blockchain technology.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>⚔️</FeatureIcon>
            <FeatureTitle>On-Chain Adventures</FeatureTitle>
            <FeatureDescription>
              Create immersive storylines where player decisions and game outcomes are recorded permanently on the blockchain.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🏰</FeatureIcon>
            <FeatureTitle>Community-Owned Realms</FeatureTitle>
            <FeatureDescription>
              Design systems where players can collectively build, govern, and expand the game world through decentralized governance.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Section dark>
        <SectionTitle>We Seek Brave Builders</SectionTitle>
        <RoleGrid>
          <RoleCard>
            <RoleTitle>Game Developers</RoleTitle>
            <RoleDescription>
              Skilled in React, TypeScript, and blockchain integration to build the core gaming experience.
            </RoleDescription>
          </RoleCard>
          <RoleCard>
            <RoleTitle>Smart Contract Engineers</RoleTitle>
            <RoleDescription>
              Masters of Solidity or Move to create the on-chain logic that powers our decentralized realm.
            </RoleDescription>
          </RoleCard>
          <RoleCard>
            <RoleTitle>Game Designers</RoleTitle>
            <RoleDescription>
              Creative minds who can reimagine traditional DnD mechanics for the blockchain era.
            </RoleDescription>
          </RoleCard>
          <RoleCard>
            <RoleTitle>Digital Artists</RoleTitle>
            <RoleDescription>
              Visionaries who can bring Lord Smearington&apos;s Realm to life with captivating visuals and NFT designs.
            </RoleDescription>
          </RoleCard>
        </RoleGrid>
      </Section>

      <Section>
        <SectionTitle>The Roadmap</SectionTitle>
        <Roadmap>
          <RoadmapItem>
            <RoadmapIcon>📜</RoadmapIcon>
            <RoadmapContent>
              <RoadmapTitle>Phase I: Assembly</RoadmapTitle>
              <RoadmapDescription>
                Gathering our fellowship of builders and establishing the technical foundation.
              </RoadmapDescription>
            </RoadmapContent>
          </RoadmapItem>
          <RoadmapItem>
            <RoadmapIcon>🔨</RoadmapIcon>
            <RoadmapContent>
              <RoadmapTitle>Phase II: Construction</RoadmapTitle>
              <RoadmapDescription>
                Building the core game mechanics, smart contracts, and initial world design.
              </RoadmapDescription>
            </RoadmapContent>
          </RoadmapItem>
          <RoadmapItem>
            <RoadmapIcon>🧪</RoadmapIcon>
            <RoadmapContent>
              <RoadmapTitle>Phase III: Testing</RoadmapTitle>
              <RoadmapDescription>
                Alpha and beta testing with our early adventurers to refine the experience.
              </RoadmapDescription>
            </RoadmapContent>
          </RoadmapItem>
          <RoadmapItem>
            <RoadmapIcon>🚀</RoadmapIcon>
            <RoadmapContent>
              <RoadmapTitle>Phase IV: Launch</RoadmapTitle>
              <RoadmapDescription>
                Opening the gates to Lord Smearington&apos;s Realm for all adventurers.
              </RoadmapDescription>
            </RoadmapContent>
          </RoadmapItem>
        </Roadmap>
      </Section>

      <JoinSection id="join-us">
        <JoinTitle>Ready to Join the Adventure?</JoinTitle>
        <JoinDescription>
          Lord Smearington awaits those brave enough to help build his realm. Apply now to join our fellowship of builders.
        </JoinDescription>
        <ButtonGroup>
          <PrimaryButton href="/events">Join IRL</PrimaryButton>
          <SecondaryButton href="https://discord.gg/kSuS9kdgTk" target="_blank">Join Online</SecondaryButton>
        </ButtonGroup>
      </JoinSection>

      <Footer>
        <FooterText>© 2023 Lord Smearington&apos;s Realm. All rights reserved.</FooterText>
        <FooterLinks>
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinks>
      </Footer>
    </Container>
  );
};

export default DnDPage;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #0d1117;
  color: #e6edf3;
`;

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('/images/dnd-background.jpg');
  background-size: cover;
  background-position: center;
  overflow: hidden;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 17, 23, 0.7);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 20px;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #feca57;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled.a`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(255, 107, 107, 0.6);
  }
`;

const Section = styled.section<{ dark?: boolean }>`
  padding: 5rem 2rem;
  background-color: ${(props: { dark?: boolean }) => props.dark ? '#161b22' : '#0d1117'};
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #feca57;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b, #feca57);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(22, 27, 34, 0.8);
  border-radius: 10px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border-color: rgba(254, 202, 87, 0.5);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #e6edf3;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #8b949e;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const RoleCard = styled.div`
  background: rgba(13, 17, 23, 0.8);
  border-radius: 10px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 107, 107, 0.5);
  }
`;

const RoleTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ff6b6b;
`;

const RoleDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #8b949e;
`;

const Roadmap = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const RoadmapItem = styled.div`
  display: flex;
  margin-bottom: 2.5rem;
  position: relative;
  
  &:not(:last-child):after {
    content: '';
    position: absolute;
    top: 50px;
    left: 25px;
    width: 2px;
    height: calc(100% + 1rem);
    background: linear-gradient(to bottom, #ff6b6b, rgba(255, 107, 107, 0.1));
  }
`;

const RoadmapIcon = styled.div`
  font-size: 2rem;
  background: #161b22;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  position: relative;
  z-index: 1;
  border: 2px solid #ff6b6b;
`;

const RoadmapContent = styled.div`
  flex: 1;
`;

const RoadmapTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #e6edf3;
`;

const RoadmapDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #8b949e;
`;

const JoinSection = styled.section`
  padding: 5rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(254, 202, 87, 0.1));
`;

const JoinTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #e6edf3;
`;

const JoinDescription = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 2.5rem;
  color: #8b949e;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.a`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(255, 107, 107, 0.6);
  }
`;

const SecondaryButton = styled.a`
  background: transparent;
  color: #e6edf3;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: 2px solid #ff6b6b;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.1);
    transform: translateY(-3px);
  }
`;

const Footer = styled.footer`
  padding: 2rem;
  background-color: #161b22;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterText = styled.p`
  color: #8b949e;
  font-size: 0.9rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #8b949e;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e6edf3;
  }
`;
