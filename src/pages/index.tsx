import React from "react";
import { keyframes } from "@emotion/react";
import { FaPalette, FaStar, FaCrown } from "react-icons/fa";
import Link from "next/link";
import styled from "@emotion/styled";
import Events from "@/components/Events";

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        {/* Animated background effects */}
        <HeroBackground />

        {/* Floating elements */}
        {[...Array(15)].map((_, i) => (
          <FloatingElement
            key={i}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            animationDuration={`${Math.random() * 5 + 3}s`}
          >
            {i % 3 === 0 ? (
              <FloatingIcon className="fa-palette">
                <FaPalette />
              </FloatingIcon>
            ) : i % 3 === 1 ? (
              <FloatingIcon className="fa-crown">
                <FaCrown />
              </FloatingIcon>
            ) : (
              <FloatingIcon className="fa-star">
                <FaStar />
              </FloatingIcon>
            )}
          </FloatingElement>
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
            <CrownIcon>
              <FaCrown />
            </CrownIcon>
            <HeroBox>
              <HeroTitle>
                You are invited to <br />
                Lord Smearington&apos;s <br />
                Absurd Gallery
              </HeroTitle>
              <HeroSubtitle as="h2">
                An Interdimensional Art Gallery Experience
              </HeroSubtitle>
              <HeroDescription>
                A Sui Overflow 2025 Hackathon Project – Minted on Sui, Judged by
                Madness
              </HeroDescription>

              <ButtonGroup>
                <SecondaryButton>
                  <Link href="/rsvp">
                    <Flex style={{ alignItems: "center" }}>RSVP </Flex>
                  </Link>
                </SecondaryButton>
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
              <AboutBadge>THE VISIONARY</AboutBadge>
              <AboutHeading as="h2">Who Is Lord Smearington?</AboutHeading>
              <AboutText>
                Lord Smearington, the inter-dimensional art prophet, reveals the
                mystical magic in every canvas. Built for the Sui Overflow 2025
                Hackathon, this gallery leverages blockchain technology to build
                the first-of-its-kind inter-dimensional art gallery experience,
                where you are the narrator of an absurd story.
              </AboutText>
            </AboutTextBox>

            <ImageBox>
              <ImageGlow />
              <ImageContainer>
                <ProfileImage
                  src="/images/lord-smearington.jpg"
                  alt="Lord Smearington"
                />
                <ProfileBadge>The Prophet</ProfileBadge>
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
            <CrownDivider>
              <FaCrown />
            </CrownDivider>
            Join Our Absurd Community
            <CrownDivider>
              <FaCrown />
            </CrownDivider>
          </CommunitySectionTitle>

          <CommunityContent>
            <Events />
          </CommunityContent>
        </CommunityContainer>
      </CommunitySection>
    </Box>
  );
}

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.7); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Styled components
const Box = styled.div`
  font-family: "Cormorant Garamond", serif;
`;

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
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  font-weight: bold;
`;

const Text = styled.p`
  font-family: "Cormorant Garamond", "Lato", sans-serif;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #5a3e85;
  color: white;
  border-radius: 0.25rem;
  border: 1px solid #ffd700;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b4c99;
  color: white;
  border: 2px solid #ffd700;
  border-radius: 0.25rem;
  font-family: "Cinzel Decorative", serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    background-color: #5a3e85;
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
  background: linear-gradient(to bottom right, #3b4c99, #5a3e85);
  overflow: hidden;
  @media (max-width: 768px) {
    min-height: 88vh;
  }
`;

const HeroBackground = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.2;
  background-image: url("/images/unicorn-nft-bg.png");
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 0;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("/images/fabric-texture.png");
    opacity: 0.3;
    mix-blend-mode: overlay;
  }
`;

const FloatingElement = styled(Box)<{
  top: string;
  left: string;
  animationDuration: string;
}>`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 1;
  animation: ${float} ${(props) => props.animationDuration} infinite ease-in-out;
  opacity: 0.6;

  @media (max-width: 768px) {
    /* display: none; */
    opacity: 0.2;
  }
`;

const FloatingIcon = styled.div`
  color: #ffd700;
  font-size: 1.5rem;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.7));
  opacity: 0.6;

  &.fa-palette {
    color: #f4c4f3;
  }

  &.fa-crown {
    color: #ffd700;
    font-size: 2rem;
  }

  &.fa-star {
    color: #c7bfd4;
  }
`;

const FloatingStar = styled(Box)<{
  top: string;
  left: string;
  animationDuration: string;
}>`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 1;
  animation: ${float} ${(props) => props.animationDuration} infinite ease-in-out;
  opacity: 0.6;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StarIcon = styled(IconWrapper)<{ color: string; fontSize: string }>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
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

const CrownIcon = styled.div`
  color: #ffd700;
  font-size: 3rem;
  margin-bottom: -1.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
`;

const HeroBox = styled(Box)`
  padding: 2rem;
  border-radius: 0.75rem;
  background: rgba(59, 76, 153, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  border: 3px solid #ffd700;
  max-width: 900px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const HeroTitle = styled(Heading)`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  animation: ${pulse} 3s infinite ease-in-out;
  background: linear-gradient(90deg, #f4c4f3, #fc67fa, #f4c4f3);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 6s linear infinite;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const HeroSubtitle = styled(Heading)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  font-style: italic;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.7);
  letter-spacing: 0.025em;
  color: #c7bfd4;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const HeroDescription = styled(Text)`
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
  color: #c7bfd4;

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

const SecondaryButton = styled(Button)`
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #5a3e85;
  border: 2px solid #ffd700;
  font-weight: 600;
  font-family: "Cinzel Decorative", serif;
  letter-spacing: 0.35em;

  &:hover {
    background-color: #3b4c99;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
`;

// About section styled components
const AboutSection = styled(Box)`
  padding: 6rem 0;
  background: #1a1a2e;
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
  background: radial-gradient(circle at 80% 20%, #5a3e85 0%, transparent 60%);
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
  background-color: #3b4c99;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  font-weight: bold;
  border: 1px solid #ffd700;
`;

const AboutHeading = styled(Heading)`
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #f4c4f3, #fc67fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const AboutText = styled(Text)`
  font-size: 1.25rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #c7bfd4;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    line-height: 1.6;
  }
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
  background: linear-gradient(to bottom right, #5a3e85, #fc67fa);
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: rotate(3deg);
  border: 4px solid #ffd700;
  animation: ${pulse} 5s infinite ease-in-out;
  transition: all 0.3s ease;
`;

const ProfileBadge = styled(Box)`
  position: absolute;
  top: -15px;
  right: -15px;
  background-color: #3b4c99;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transform: rotate(15deg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  font-weight: bold;
  letter-spacing: 0.025em;
  border: 2px solid #ffd700;

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
  background: #1a1a2e;
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
  background: radial-gradient(circle at 20% 80%, #fc67fa 0%, transparent 60%);
  opacity: 0.2;
`;

const CommunityContainer = styled(Container)`
  position: relative;
  z-index: 2;
`;

const CrownDivider = styled.span`
  display: inline-block;
  color: #ffd700;
  font-size: 1.5rem;
  margin: 0 1rem;
  vertical-align: middle;
`;

const CommunitySectionTitle = styled(Heading)`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: #f4c4f3;
  letter-spacing: -0.025em;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);

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
