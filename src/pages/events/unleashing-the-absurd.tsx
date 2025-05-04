import React from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
import { keyframes } from "@emotion/react";
import { FaPalette, FaStar, FaCrown } from "react-icons/fa";
import { ActionButton } from "@/components/Buttons";

// Animation keyframes
const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1) rotate(3deg);
  }
  50% {
    transform: scale(1.05) rotate(3deg);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
`;

// Styled components
const PageWrapper = styled.div`
  background-color: #1a1a2e;
  color: #c7bfd4;
  min-height: 100vh;
  font-family: "Cormorant Garamond", "Lato", sans-serif;
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled.div`
  position: relative;
  height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #2a3a8c, #4a2e75);
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  padding: 0 16px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(63, 34, 106, 0.8), rgba(39, 55, 126, 0.8));
    z-index: 1;
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    padding: 0 32px;
    height: 100vh;
    text-align: left;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      rgba(40, 55, 130, 0.8),
      rgba(75, 45, 115, 0.8)
    ),
    url("/images/lord-smearington.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  font-weight: 700;
  line-height: 1.2;
  color: #ffffff;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.7), 0 0 5px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
  font-size: 1.25rem;

  span {
    background: linear-gradient(to right, #f4c4f3, #fc67fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 10px rgba(244, 196, 243, 0.8);
  }

  @media (min-width: 768px) {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const ContentSection = styled.div<{
  paddingY?: string;
  marginTop?: string;
  marginBottom?: string;
  position?: string;
  height?: string;
  width?: string;
}>`
  padding-top: ${(props) => (props.paddingY ? `${props.paddingY}px` : "0")};
  padding-bottom: ${(props) => (props.paddingY ? `${props.paddingY}px` : "0")};
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}rem` : "0")};
  margin-bottom: ${(props) =>
    props.marginBottom ? `${props.marginBottom}rem` : "0"};
  position: ${(props) => props.position || "static"};
  height: ${(props) => props.height || "auto"};
  width: ${(props) => props.width || "auto"};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
`;

const GridItem = styled.div<{ span: number; md?: number }>`
  grid-column: span ${(props) => props.span};

  @media (min-width: 768px) {
    grid-column: span ${(props) => props.md || props.span};
  }
`;

const SectionTitle = styled.h2`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(to right, #f4c4f3, #fc67fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, #f4c4f3, #fc67fa);
  }
`;

const BodyText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 24px;
  color: #c7bfd4;
`;

const EventDetail = styled.p`
  color: #ffd700;
  margin-bottom: 8px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.5);
  font-weight: 600;
`;

const FeatureTitle = styled.h3`
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  color: #ffd700;
  position: relative;
  display: inline-block;

  &:before {
    content: "✧";
    position: absolute;
    left: -20px;
    color: #ffd700;
  }

  &:after {
    content: "✧";
    position: absolute;
    right: -20px;
    color: #ffd700;
  }
`;

const FeatureBox = styled.div`
  background: rgba(59, 76, 153, 0.2);
  border: 1px solid #ffd700;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 215, 0, 0.1);
  }
`;

const FeatureDescription = styled.p`
  margin-bottom: 16px;
  line-height: 1.6;
  text-align: center;
`;

const FeatureIcon = styled.div`
  color: #ffd700;
  font-size: 2rem;
  margin-bottom: 16px;
  animation: ${float} 3s infinite ease-in-out;
`;

const FooterText = styled.p`
  color: #c7bfd4;
  text-align: center;
  padding: 2rem 0;
  font-family: "Cinzel", serif;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 1px;
    background: linear-gradient(to right, transparent, #ffd700, transparent);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border: 4px solid #ffd700;
  border-radius: 8px;
  overflow: hidden;
  animation: ${glow} 4s infinite ease-in-out;
  transform: rotate(3deg);
`;

const FloatingElement = styled.div<{
  top: string;
  left: string;
  animationDuration: string;
}>`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 1;
  animation: ${float} ${(props) => props.animationDuration} infinite ease-in-out;
  opacity: 0.3;
  color: #ffd700;
  font-size: 1.5rem;
`;

const QuoteBox = styled.div`
  background: rgba(90, 62, 133, 0.2);
  border-left: 4px solid #ffd700;
  padding: 20px;
  margin: 20px 0;
  position: relative;

  &:before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 10px;
    font-size: 4rem;
    color: rgba(255, 215, 0, 0.2);
    font-family: "Cinzel Decorative", serif;
  }
`;

const CrownDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  color: #ffd700;

  &:before,
  &:after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #ffd700, transparent);
    margin: 0 15px;
  }
`;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      metadata: {
        title:
          "Opening Saturday, May 17th - ???, 2025: Unleashing the Absurd: An Inter-dimensional Art Gallery Experience",
        description:
          "Join Lord Smearington for a first of its kind inter-dimensional art gallery experience.",
        image: "/images/lord-smearington.jpg",
        url: "https://smearington.theethical.ai/events/unleashing-the-absurd",
      },
    },
  };
};

const InterdimensionalArtGallery: React.FC = () => {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <video autoPlay muted loop playsInline>
          <source src="/videos/lord-smearington-unsleah.mp4" type="video/mp4" />
        </video>
        {/* <HeroBackground /> */}

        {/* Floating elements */}
        {[...Array(8)].map((_, i) => (
          <FloatingElement
            key={i}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            animationDuration={`${Math.random() * 5 + 3}s`}
          >
            {i % 3 === 0 ? (
              <FaPalette />
            ) : i % 3 === 1 ? (
              <FaCrown />
            ) : (
              <FaStar />
            )}
          </FloatingElement>
        ))}

        <Container>
          <HeroTitle>
            <span style={{ fontSize: "3rem" }}>Unleashing the Absurd</span>
            <br />
            An Inter-dimensional Art Gallery Experience
          </HeroTitle>

          <ContentSection marginTop="2" >
            <EventDetail style={{ fontSize: "1.2rem" }}>
              Saturday, May 17th, 2025
            </EventDetail>
            <EventDetail style={{ fontSize: "0.8rem" }}>
              2:00 PM - 8:00 PM
            </EventDetail>

            <EventDetail style={{ fontSize: "1.2rem", marginTop: "2rem" }}>
              Studio 202
            </EventDetail>
            <EventDetail style={{ fontSize: "0.8rem" }}>
              Russell Industrial Center
            </EventDetail>

            <EventDetail
              style={{
                fontSize: "0.6rem",
                marginTop: "2rem",
              }}
            >
              <strong>Curated by</strong>
            </EventDetail>
            <EventDetail>Lord Smearington</EventDetail>
            <EventDetail style={{ fontSize: "0.8rem" }}>
              Interdimensional Art Prophet
            </EventDetail>

            <ActionButton href="/rsvp">RSVP</ActionButton>
          </ContentSection>
        </Container>
      </HeroSection>

      {/* Gallery Description */}
      <Container>
        <ContentSection paddingY="10" marginTop="1">
          <Grid>
            <GridItem span={12} md={6}>
              <SectionTitle>Step Into the Void Between Dimensions</SectionTitle>

              <BodyText>
                Mortals and cosmic entities alike, I, Lord Smearington, invite
                you to traverse the boundaries of reality at my
                Inter-dimensional Art Gallery. Opening Saturday, May 17th, 2025,
                the veil between worlds will thin, allowing glimpses into realms
                beyond human comprehension.
              </BodyText>

              <BodyText>
                This is not merely an exhibition but a journey through the
                absurd landscapes of my mind, where digital art, physical
                installations, and interactive experiences collide in a symphony
                of beautiful chaos.
              </BodyText>
            </GridItem>
            <GridItem span={12} md={6}>
              <ContentSection position="relative" height="400" width="100%">
                <ImageContainer>
                  <Image
                    src="/images/lord-smearington.jpg"
                    alt="Inter-dimensional Art Gallery Preview"
                    layout="fill"
                    objectFit="contain"
                  />
                </ImageContainer>
              </ContentSection>
            </GridItem>
          </Grid>
        </ContentSection>

        <CrownDivider>
          <FaCrown size={24} />
        </CrownDivider>

        {/* Exhibition Features */}
        <ContentSection paddingY="10">
          <SectionTitle style={{ textAlign: "center", marginBottom: "40px" }}>
            Gallery Features
          </SectionTitle>
          <Grid>
            <GridItem span={12} md={4}>
              <FeatureBox>
                <FeatureIcon>
                  <FaPalette />
                </FeatureIcon>
                <FeatureTitle>Digital Portals</FeatureTitle>
                <FeatureDescription>
                  AI-generated artworks that serve as windows to other
                  dimensions, each piece a unique gateway to worlds beyond our
                  own.
                </FeatureDescription>
              </FeatureBox>
            </GridItem>
            <GridItem span={12} md={4}>
              <FeatureBox>
                <FeatureIcon>
                  <FaStar />
                </FeatureIcon>
                <FeatureTitle>Immersive Installations</FeatureTitle>
                <FeatureDescription>
                  Physical spaces transformed by light, sound, and projection
                  mapping to create environments that defy conventional reality.
                </FeatureDescription>
              </FeatureBox>
            </GridItem>
            <GridItem span={12} md={4}>
              <FeatureBox>
                <FeatureIcon>
                  <FaCrown />
                </FeatureIcon>
                <FeatureTitle>Interactive Experiences</FeatureTitle>
                <FeatureDescription>
                  Become part of the art through augmented reality elements that
                  respond to your presence and movements.
                </FeatureDescription>
              </FeatureBox>
            </GridItem>
          </Grid>
        </ContentSection>

        <CrownDivider>
          <FaCrown size={24} />
        </CrownDivider>

        {/* Artist Statement */}
        <ContentSection paddingY="10" marginBottom="10">
          <Grid>
            <GridItem span={12}>
              <SectionTitle>A Word From Lord Smearington</SectionTitle>
              <QuoteBox>
                <BodyText>
                  &ldquo;Art is the language of the cosmos, spoken through the
                  imperfect vessels of mortal creators. In this gallery, I have
                  collected whispers from the void, translated them through
                  various mediums, and arranged them in a sequence that might
                  momentarily allow your limited consciousness to perceive the
                  grand absurdity of existence. Come prepared to leave your
                  preconceptions at the door—they will only weigh you down as
                  you float through the exhibition.&rdquo;
                </BodyText>
                <BodyText style={{ marginBottom: 0 }}>
                  &ldquo;I rate this exhibition 9 screaming teacups out of 12
                  melting clocks. Attendance is mandatory for those who wish to
                  understand the true nature of creativity in our fractured
                  multiverse.&rdquo;
                </BodyText>
              </QuoteBox>
            </GridItem>
          </Grid>
        </ContentSection>
      </Container>

      <footer>
        <FooterText>
          © 2025 Lord Smearington&apos;s Realm. All rights reserved.
        </FooterText>
      </footer>
    </PageWrapper>
  );
};

export default InterdimensionalArtGallery;
