import React from 'react';
import { keyframes } from '@emotion/react';
import { FaArrowRight, FaPalette, FaStar, FaDiscord } from 'react-icons/fa';
import Link from 'next/link';
import styled from '@emotion/styled';
import Script from 'next/script';
import { FaXTwitter } from 'react-icons/fa6';

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        {/* Animated background effects */}
        <HeroBackground />
        
        {/* Dripping effects */}
        {[...Array(15)].map((_, i) => (
          <DrippingEffect
            key={i}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            width={`${Math.random() * 30 + 10}px`}
            height={`${Math.random() * 100 + 50}px`}
            background={`rgba(${Math.random() * 255}, ${Math.random() * 100}, ${Math.random() * 255}, 0.6)`}
            animationDuration={`${Math.random() * 5 + 3}s`}
          />
        ))}

        {/* Floating stars */}
        {[...Array(8)].map((_, i) => (
          <FloatingStar
            key={`star-${i}`}
            top={`${Math.random() * 80 + 10}%`}
            left={`${Math.random() * 80 + 10}%`}
            animationDuration={`${Math.random() * 4 + 3}s`}
          >
            <StarIcon 
              color={`hsl(${Math.random() * 60 + 280}, 100%, 75%)`} 
              fontSize={`${Math.random() * 20 + 10}px`}
            >
              <FaStar />
            </StarIcon>
          </FloatingStar>
        ))}

        <HeroContainer>
          <HeroContent>
            <HeroBox>
              <HeroTitle>
                Lord Smearington&apos;s Absurd NFT Gallery
              </HeroTitle>
              <HeroSubtitle as="h2">
                Where Art Screams and the Canvas Weeps
              </HeroSubtitle>
              <HeroDescription>
                A Sui Overflow 2025 Hackathon Project – Minted on Sui, Judged by Madness
              </HeroDescription>
              
              <ButtonGroup>
                <PrimaryButton>
                  <Link href="/gallery">
                    <Flex style={{ alignItems: "center" }}>
                      Explore the Gallery <ButtonIcon><FaArrowRight /></ButtonIcon>
                    </Flex>
                  </Link>
                </PrimaryButton>
                <SecondaryButton>
                  <Link href="/submit">
                    <Flex style={{ alignItems: "center" }}>
                      Submit Your Art <ButtonIcon><FaPalette /></ButtonIcon>
                    </Flex>
                  </Link>
                </SecondaryButton>
                <TwitterButton>
                  <Link href="https://twitter.com/LordSmearington" target="_blank">
                    <Flex style={{ alignItems: "center" }}>
                      Join the Chaos on <ButtonIcon><FaXTwitter /></ButtonIcon>
                    </Flex>
                  </Link>
                </TwitterButton>
              </ButtonGroup>
            </HeroBox>
          </HeroContent>
        </HeroContainer>
      </HeroSection>

      {/* About Section */}
      <AboutSection>
        <AboutBackground />
        
        <AboutContainer>
          <AboutContent>
            <AboutTextBox>
              <AboutBadge>
                THE VISIONARY
              </AboutBadge>
              <AboutHeading as="h2">
                Who Is Lord Smearington?
              </AboutHeading>
              <AboutText>
                Lord Smearington, the interdimensional art prophet, hears the secret screams of every canvas. 
                Built for the Sui Overflow 2025 Hackathon, this gallery on the Sui blockchain lets Smearington 
                critique art with unhinged absurdity. From the &apos;Venomous Sparkles out of a Shattered Disco Ball&apos; 
                NFT to one-of-one artist creations, every piece is rated in feral metaphors—like &apos;8 venomous 
                sparkles out of a shattered disco ball.&apos; Submit your art, claim NFTs, and join the madness!
              </AboutText>
              <SuiBadge>
                <SuiLogo 
                  src="/images/sui.png" 
                  alt="Sui Logo" 
                />
                Sui Overflow 2025 – Entertainment & Culture Track – Deployed on Sui Testnet
              </SuiBadge>
            </AboutTextBox>
            
            <ImageBox>
              <ImageGlow />
              <ImageContainer>
                <ProfileImage 
                  src="/images/lord-smearington.jpg" 
                  alt="Lord Smearington" 
                />
                <ProfileBadge>
                  The Prophet
                </ProfileBadge>
              </ImageContainer>
            </ImageBox>
          </AboutContent>
        </AboutContainer>
      </AboutSection>

      {/* Community Section */}
      <CommunitySection>
        <CommunityBackground />
        
        <CommunityContainer>
          <CommunitySectionTitle>
            Join Our Absurd Community
          </CommunitySectionTitle>
          
          <CommunityContent>
            <XFeedContainer>
              <XFeedBox>
                <a className="twitter-timeline"
                  href="https://twitter.com/LordSmearington"
                  data-height="400">
                  Tweets by @LordSmearington
                </a>
                <Script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></Script>
              </XFeedBox>
            </XFeedContainer>
            
            <CommunityActionBox>
              <DiscordInvite>
                <DiscordIcon>
                  <FaDiscord />
                </DiscordIcon>
                <DiscordContent>
                  <DiscordTitle>Join the Discord</DiscordTitle>
                  <DiscordText>
                    Connect with artists, collectors, and fellow enthusiasts in the RenAIssance Discord
                  </DiscordText>
                  <DiscordButton>
                    <Link href="https://discord.gg/kSuS9kdgTk" target="_blank">
                      <Flex style={{ alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        Join Discord <FaArrowRight />
                      </Flex>
                    </Link>
                  </DiscordButton>
                </DiscordContent>
              </DiscordInvite>
              
              <FollowCTA>
                <FollowButton>
                  <Link href="https://x.com/LordSmearington" target="_blank">
                    <Flex style={{ alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <span style={{ fontWeight: "bold" }}>Follow @LordSmearington</span> <FaXTwitter />
                    </Flex>
                  </Link>
                </FollowButton>
                <FollowText>Get the latest absurd art critiques directly in your feed</FollowText>
              </FollowCTA>
              
              <CommunityBadge>
                <IconWrapper style={{ fontSize: "1.5rem", marginRight: "10px" }}><FaPalette /></IconWrapper>
                <VStack style={{ alignItems: "flex-start" }}>
                  <BadgeTitle>Artist Collaborations</BadgeTitle>
                  <BadgeText>We&apos;re always looking for new artists to feature</BadgeText>
                </VStack>
              </CommunityBadge>
            </CommunityActionBox>
          </CommunityContent>
        </CommunityContainer>
      </CommunitySection>
    </Box>
  );
}


// Animation keyframes
const drip = keyframes`
  0% { transform: translateY(0); opacity: 0.8; }
  100% { transform: translateY(20px); opacity: 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

// Styled components
const Box = styled.div``;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Flex = styled.div`
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const VStack = styled.div`
  display: flex;
  flex-direction: column;
`;

const HStack = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Heading = styled.h1`
  font-weight: bold;
`;

const Text = styled.p``;

const Badge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #805AD5;
  color: white;
  border-radius: 0.25rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #805AD5;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    background-color: #6B46C1;
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// Hero section styled components
const HeroSection = styled(Box)`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #44337A, #9B2C2C, #C05621);
  overflow: hidden;
`;

const HeroBackground = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  background-image: url('/images/unicorn-nft-bg.png');
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 0;
`;

const DrippingEffect = styled(Box)<{ top: string; left: string; width: string; height: string; background: string; animationDuration: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.width};
  height: ${props => props.height};
  border-radius: full;
  background: ${props => props.background};
  animation: ${drip} ${props => props.animationDuration} infinite;
  z-index: 1;
  box-shadow: 0 0 15px rgba(255,255,255,0.3);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FloatingStar = styled(Box)<{ top: string; left: string; animationDuration: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  z-index: 1;
  animation: ${float} ${props => props.animationDuration} infinite ease-in-out;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const StarIcon = styled(IconWrapper)<{ color: string; fontSize: string }>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize};
`;

const HeroContainer = styled(Container)`
  position: relative;
  z-index: 2;
`;

const HeroContent = styled(VStack)`
  gap: 2rem;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  padding: 1rem;
`;

const HeroBox = styled(Box)`
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  border: 1px solid rgba(255,255,255,0.1);
  max-width: 900px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const HeroTitle = styled(Heading)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-family: serif;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(255,0,255,0.5);
  animation: ${pulse} 3s infinite ease-in-out;
  background: linear-gradient(to right, #F687B3, #9F7AEA, #90CDF4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.05em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const HeroSubtitle = styled(Heading)`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  font-style: italic;
  text-shadow: 0 0 5px rgba(255,255,255,0.7);
  letter-spacing: 0.025em;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const HeroDescription = styled(Text)`
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const ButtonGroup = styled(HStack)`
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const PrimaryButton = styled(Button)`
  font-size: 1rem;
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
`;

const SecondaryButton = styled(Button)`
  font-size: 1rem;
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  background-color: #D53F8C;
  
  &:hover {
    background-color: #B83280;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
`;

const TwitterButton = styled(Button)`
  font-size: 1rem;
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  background-color: #1DA1F2;
  
  &:hover {
    background-color: #1A91DA;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
`;

const ButtonIcon = styled.span`
  margin-left: 8px;
`;

// About section styled components
const AboutSection = styled(Box)`
  padding: 6rem 0;
  background: #171923;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const AboutBackground = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 80% 20%, #6B46C1 0%, transparent 60%);
  opacity: 0.4;
`;

const AboutContainer = styled(Container)`
  position: relative;
`;

const AboutContent = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const AboutTextBox = styled(Box)`
  flex: 1;
  max-width: 600px;
  
  @media (max-width: 992px) {
    max-width: 100%;
  }
`;

const AboutBadge = styled(Badge)`
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #805AD5;
  border-radius: 9999px;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  font-weight: bold;
`;

const AboutHeading = styled(Heading)`
  font-size: 1.875rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #B794F4, #ED64A6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  font-weight: 800;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AboutText = styled(Text)`
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #CBD5E0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const SuiBadge = styled(Badge)`
  padding: 0.75rem 1rem;
  background-color: #2C5282;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid;
  border-color: #2B4FD2;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
`;

const SuiLogo = styled(Image)`
  height: 12px;
  margin-right: 8px;
`;

const ImageBox = styled(Box)`
  flex: 1;
  max-width: 400px;
  position: relative;
  
  @media (max-width: 992px) {
    max-width: 300px;
    margin: 0 auto;
  }
`;

const ImageGlow = styled(Box)`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, #805AD5, #D53F8C);
  filter: blur(25px);
  opacity: 0.6;
  z-index: 0;
`;

const ImageContainer = styled(Box)`
  position: relative;
  z-index: 1;
`;

const ProfileImage = styled(Image)`
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: rotate(3deg);
  border: 4px solid;
  border-color: #805AD5;
  animation: ${pulse} 5s infinite ease-in-out;
  transition: all 0.3s ease;
`;

const ProfileBadge = styled(Box)`
  position: absolute;
  top: -15px;
  right: -15px;
  background-color: #E53E3E;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transform: rotate(15deg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  font-weight: bold;
  letter-spacing: 0.025em;
  border: 2px solid;
  border-color: #FC8181;
  
  @media (max-width: 480px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    top: -10px;
    right: -10px;
  }
`;

// Community section styled components
const CommunitySection = styled(Box)`
  padding: 6rem 0;
  background: #1A202C;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const CommunityBackground = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, #D53F8C 0%, transparent 60%);
  opacity: 0.3;
`;

const CommunityContainer = styled(Container)`
  position: relative;
  z-index: 2;
`;

const CommunitySectionTitle = styled(Heading)`
  font-size: 2.25rem;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(to right, #ED64A6, #F687B3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  font-weight: 800;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }
`;

const CommunityContent = styled(Flex)`
  gap: 2rem;
  align-items: stretch;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const XFeedContainer = styled(Box)`
  flex: 3;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const XFeedBox = styled(Box)`
  border-radius: 0.75rem;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  min-height: 400px;
`;

const CommunityActionBox = styled(VStack)`
  flex: 2;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const DiscordInvite = styled(Box)`
  background: rgba(114, 137, 218, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(114, 137, 218, 0.4);
  display: flex;
  gap: 1.5rem;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const DiscordIcon = styled(IconWrapper)`
  font-size: 3rem;
  color: #7289DA;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const DiscordContent = styled(VStack)`
  gap: 1rem;
  flex: 1;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const DiscordTitle = styled(Heading)`
  font-size: 1.25rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const DiscordText = styled(Text)`
  color: #CBD5E0;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const DiscordButton = styled(Button)`
  background-color: #7289DA;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  
  &:hover {
    background-color: #5E78D5;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const FollowCTA = styled(Box)`
  background: rgba(29, 161, 242, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(29, 161, 242, 0.4);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FollowButton = styled(Button)`
  background-color: #1DA1F2;
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #1A91DA;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }
`;

const FollowText = styled(Text)`
  color: #CBD5E0;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CommunityBadge = styled(Box)`
  background: rgba(237, 100, 166, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(237, 100, 166, 0.4);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
`;

const BadgeTitle = styled(Heading)`
  font-size: 1rem;
  color: white;
  margin-bottom: 0.25rem;
`;

const BadgeText = styled(Text)`
  color: #CBD5E0;
  font-size: 0.875rem;
`;