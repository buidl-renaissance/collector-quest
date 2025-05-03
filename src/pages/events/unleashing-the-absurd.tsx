import Image from "next/image";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";

// Styled components
const PageWrapper = styled.div`
  background-color: #0a0a1a;
  color: white;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
`;

const HeroSection = styled.div`
  position: relative;
  height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("/images/lord-smearington.jpg");
  background-size: cover;
  background-position: center;
  font-family: "Cinzel", serif;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0 32px;
    height: 100vh;
    text-align: left;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  width: 100%;
`;

const HeroTitle = styled.h1<{ theme?: any }>`
  font-family: "Cinzel", serif;
  font-size: ${(props) =>
    props.theme?.breakpoints?.up("md") ? "4rem" : "1.5rem"};
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  margin-bottom: 1rem;
  font-size: 1.25rem;

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
  margin-bottom: ${(props) => props.marginBottom ? `${props.marginBottom}rem` : "0"};
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
  font-family: "Cinzel", serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #d4af37;
`;

const BodyText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 24px;
`;

const EventDetail = styled.p`
  color: #d4af37;
  margin-bottom: 8px;
`;

const FeatureTitle = styled.h3`
  font-family: "Cinzel", serif;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  color: #d4af37;
`;

const FeatureDescription = styled.p`
  margin-bottom: 16px;
  line-height: 1.6;
`;

const FooterText = styled.p`
  color: #fff;
  text-align: center;
  padding: 2rem 0;
`;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      metadata: {
        title: "Opening Saturday, May 17th - ???, 2025: Unleashing the Absurd: An Inter-dimensional Art Gallery Experience",
        description: "Join Lord Smearington for a first of its kind inter-dimensional art gallery experience.",
        image: "/images/lord-smearington.jpg",
        url: "https://smearington.theethical.ai/events/unleashing-the-absurd",
      },
    },
  };
};

const InterdimensionalArtGallery: React.FC = () => {
  return (
    <PageWrapper>
      {/* <NavigationBar /> */}
      
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <HeroTitle>
            <span style={{ fontSize: "3rem" }}>Unleashing the Absurd</span>
            <br />An Interdimensional Art Gallery presented by Lord Smearington
          </HeroTitle>

          <ContentSection marginTop="2" marginBottom="4">
            <EventDetail style={{ fontSize: "1.2rem" }}>
              Saturday, May 17th, 2025
            </EventDetail>
            <EventDetail style={{ fontSize: "0.8rem" }}>2:00 PM - 8:00 PM</EventDetail>

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
          </ContentSection>
        </Container>
      </HeroSection>

      {/* Gallery Description */}
      <Container>
        <ContentSection paddingY="10" marginTop="10">
          <Grid>
            <GridItem span={12} md={6}>
              <SectionTitle>
                Step Into the Void Between Dimensions
              </SectionTitle>

              <BodyText>
                Mortals and cosmic entities alike, I, Lord Smearington, invite you to traverse the boundaries of reality at my Inter-dimensional Art Gallery. Opening Saturday, May 17th, 2025, the veil between worlds will thin, allowing glimpses into realms beyond human comprehension.
              </BodyText>
              
              <BodyText>
                This is not merely an exhibition but a journey through the absurd landscapes of my mind, where digital art, physical installations, and interactive experiences collide in a symphony of beautiful chaos.
              </BodyText>
            </GridItem>
            <GridItem span={12} md={6}>
              <ContentSection position="relative" height="400" width="100%">
                <Image
                  src="/images/lord-smearington.jpg"
                  alt="Inter-dimensional Art Gallery Preview"
                  layout="fill"
                  objectFit="contain"
                />
              </ContentSection>
            </GridItem>
          </Grid>
        </ContentSection>

        {/* Exhibition Features */}
        <ContentSection paddingY="10">
          <SectionTitle style={{ textAlign: "center" }}>Gallery Features</SectionTitle>
          <Grid>
            <GridItem span={12} md={4}>
              <FeatureTitle>Digital Portals</FeatureTitle>
              <FeatureDescription>
                AI-generated artworks that serve as windows to other dimensions, each piece a unique gateway to worlds beyond our own.
              </FeatureDescription>
            </GridItem>
            <GridItem span={12} md={4}>
              <FeatureTitle>Immersive Installations</FeatureTitle>
              <FeatureDescription>
                Physical spaces transformed by light, sound, and projection mapping to create environments that defy conventional reality.
              </FeatureDescription>
            </GridItem>
            <GridItem span={12} md={4}>
              <FeatureTitle>Interactive Experiences</FeatureTitle>
              <FeatureDescription>
                Become part of the art through augmented reality elements that respond to your presence and movements.
              </FeatureDescription>
            </GridItem>
          </Grid>
        </ContentSection>

        {/* Artist Statement */}
        <ContentSection paddingY="10" marginBottom="10">
          <Grid>
            <GridItem span={12}>
              <SectionTitle>A Word From Lord Smearington</SectionTitle>
              <BodyText>
                &ldquo;Art is the language of the cosmos, spoken through the imperfect vessels of mortal creators. In this gallery, I have collected whispers from the void, translated them through various mediums, and arranged them in a sequence that might momentarily allow your limited consciousness to perceive the grand absurdity of existence. Come prepared to leave your preconceptions at the door—they will only weigh you down as you float through the exhibition.&rdquo;
              </BodyText>
              <BodyText>
                &ldquo;I rate this exhibition 9 screaming teacups out of 12 melting clocks. Attendance is mandatory for those who wish to understand the true nature of creativity in our fractured multiverse.&rdquo;
              </BodyText>
            </GridItem>
          </Grid>
        </ContentSection>
      </Container>

      <footer>
        <FooterText>© 2023 Lord Smearington&apos;s Realm. All rights reserved.</FooterText>
      </footer>
    </PageWrapper>
  );
};

export default InterdimensionalArtGallery;