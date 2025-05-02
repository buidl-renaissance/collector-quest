
import Image from "next/image";
import styled from "@emotion/styled";
import { GetServerSideProps } from "next";
// import TwitterIcon from '@mui/icons-material/Twitter';
// import DiscordIcon from '@mui/icons-material/Discord';

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
  font-family: "Cinzel", serif;
  /* text-align: center; */
  padding: 0 16px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
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

  > div {
    position: relative;
    z-index: 2;
  }

  @media (min-width: 768px) {
    padding: 0 32px;
    height: 100vh;
    text-align: left;
  }
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

// const HeroSubtitle = styled.h5`
//   margin: 0.5rem 0;
//   color: #e0e0e0;
//   font-family: "Inter", sans-serif;
//   padding: 0 8px;
//   font-size: 0.9rem;
//   margin-top: 1rem;

//   @media (min-width: 768px) {
//     margin: 1rem 0;
//     padding: 0;
//   }
// `;

const PrimaryButton = styled.button`
  background-color: #d4af37;
  color: #000;
  font-weight: bold;
  font-size: 0.8rem;
  margin-top: 1rem;
  padding: 12px 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: "Cinzel", serif;
  &:hover {
    background-color: #f5cc50;
  }
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

// const SecondaryButton = styled.button`
//   background: transparent;
//   border: 1px solid #d4af37;
//   border-radius: 4px;
//   font-size: 1rem;
//   color: #d4af37;
//   padding: 12px 32px;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   &:hover {
//     border-color: #f5cc50;
//     color: #f5cc50;
//   }
// `;

const SectionTitle = styled.h2<{ theme?: any }>`
  font-family: "Cinzel", serif;
  font-size: ${(props) =>
    props.theme?.breakpoints?.up("md") ? "3rem" : "2rem"};
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 32px;
`;

const DarkSection = styled.section`
  background-color: #0f0f2a;
  padding: 80px 0;
`;

const FeatureCard = styled.div`
  padding: 32px;
  height: 100%;
  background-color: rgba(20, 20, 50, 0.7);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const IconCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #1a1a4a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 1rem;
`;

const BenefitNumber = styled.div`
  min-width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37, #f5cc50);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-right: 1rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.7);
  }
`;

const BenefitsContainer = styled.div`
  background-image: linear-gradient(
      rgba(10, 10, 26, 0.85),
      rgba(10, 10, 26, 0.9)
    ),
    url("/images/swirling-paint.jpg");
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(5px);

  @media (min-width: 768px) {
    padding: 48px;
  }
`;

const BenefitText = styled.h4`
  font-weight: 400;
  line-height: 1.8;
  font-size: 1.25rem;
  color: #f0f0f0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.02em;
  margin: 0;
`;

const Footer = styled.footer`
  background-color: #0a0a1a;
  padding: 32px 0;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
`;

const GridItem = styled.div<{ span?: number; md?: number }>`
  grid-column: span ${(props) => props.span || 12};

  @media (min-width: 900px) {
    grid-column: span ${(props) => props.md || props.span || 12};
  }
`;

const FlexContainer = styled.div<{
  justifyContent?: string;
  marginBottom?: string;
  marginTop?: string;
  gap?: string;
  flexDirection?: string;
  alignItems?: string;
}>`
  display: flex;
  justify-content: ${(props) => props.justifyContent || "flex-start"};
  margin-bottom: ${(props) => props.marginBottom || "0"};
  margin-top: ${(props) => props.marginTop || "0"};
  gap: ${(props) => props.gap || "0"};
  flex-direction: ${(props) => props.flexDirection || "row"};
  align-items: ${(props) => props.alignItems || "stretch"};
`;

const ContentSection = styled.div<{
  paddingY?: string;
  marginBottom?: string;
  marginTop?: string;
  position?: string;
  height?: string;
  width?: string;
}>`
  padding-top: ${(props) => props.paddingY || "0"};
  padding-bottom: ${(props) => props.paddingY || "0"};
  margin-bottom: ${(props) => props.marginBottom || "0"};
  margin-top: ${(props) => props.marginTop || "0"};
  position: ${(props) => props.position || "static"};
  height: ${(props) => props.height || "auto"};
  width: ${(props) => props.width || "auto"};
`;

const EventDetail = styled.p`
  margin-bottom: 0px;
  font-weight: bold;
`;

const BodyText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 24px;
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

const FeatureQuote = styled.p`
  font-style: italic;
  color: #d4af37;
  text-align: center;
  font-weight: 500;
`;

const EventDetailTitle = styled.h3`
  font-family: "Cinzel", serif;
  color: #fff;
  margin-bottom: 16px;
  font-size: 1.25rem;
`;

// const RegistrationNote = styled.p`
//   color: #d4af37;
//   margin-top: 32px;
//   font-style: italic;
// `;

const FooterText = styled.p`
  color: #fff;
  text-align: center;
`;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      metadata: {
        title:
          "Unleashing the Absurd: A Creator Workshop on AI with Lord Smearington",
        description:
          "Join Lord Smearington for a workshop and demo on AI tools, creative prompting, and the absurd. Register now to unleash your creativity!",
        image: "/images/lord-smearington-summoning.jpg",
        url: "https://smearington.theethical.ai/workshop",
      },
    },
  };
};

const WorkshopPage: React.FC = () => {
  //   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     // Handle form submission logic here
  //     console.log('Form submitted');
  //   };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <video autoPlay muted loop playsInline>
          <source src="/videos/unicorn-paint.mp4" type="video/mp4" />
        </video>
        <Container>
          <HeroTitle>
            <span style={{ fontSize: "3rem" }}>Embracing the Absurd</span>
            <br />AI Creator Workshop with Lord Smearington
          </HeroTitle>

          <ContentSection marginTop="2" marginBottom="4">
            <EventDetail style={{ fontSize: "1.2rem" }}>
              Wednesday, May 14th, 2025
            </EventDetail>
            <EventDetail style={{ fontSize: "0.8rem" }}>8:00 PM</EventDetail>

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
              <strong>Hosted by</strong>
            </EventDetail>
            <EventDetail>Lord Smearington</EventDetail>
            <EventDetail style={{ fontSize: "0.8rem" }}>
              Interdimensional Art Prophet
            </EventDetail>

            {/* <EventHashtag>#SmearingtonSees #SuiOverflow2025</EventHashtag> */}

            {/* <HeroSubtitle>
              Join the interdimensional art prophet to forge NFTs, wield magical
              AI powers, and face the chaos of the Absurd NFT Gallery!
            </HeroSubtitle> */}
          </ContentSection>

          {/* <PrimaryButton onClick={() => (window.location.href = "#register")}>
            Register Now for the Chaos
          </PrimaryButton> */}

          {/* <SecondaryButton 
            onClick={() => window.open("https://discord.gg/suihackathons", "_blank")}
            style={{ marginLeft: '16px' }}
          >
            Join the Sui Hackathons Discord
          </SecondaryButton> */}
        </Container>
      </HeroSection>

      {/* Welcome Section */}
      <Container>
        <ContentSection paddingY="10" marginTop="10">
          <Grid>
            <GridItem span={12} md={6}>
              <SectionTitle>
                Lord Smearington Summons You to the AI Realm!
              </SectionTitle>

              <BodyText>
                Mortals of the digital realm, I, Lord Smearington, seer of
                screaming pixels, summon you to my absurd AI workshop! On May
                21st, 2025, the algorithms wail in neon despair as we forge
                creative masterpieces with artificial intelligence. Prepare for
                chaos, for I rate this workshop 7 feral teacups out of a
                shattered neural network! Join me to unleash the absurd, create
                AI art, and face my unhinged judgment.
              </BodyText>
            </GridItem>
            <GridItem span={12} md={6}>
              <ContentSection position="relative" height="400" width="100%">
                <Image
                  src="/images/venomous-sparkles.jpg"
                  alt="Venomous Sparkles out of a Shattered Neural Network"
                  layout="fill"
                  objectFit="contain"
                  className="animate-drip"
                />
              </ContentSection>
            </GridItem>
          </Grid>
        </ContentSection>
      </Container>

      {/* Workshop Highlights */}
      <DarkSection>
        <Container>
          <SectionTitle style={{ textAlign: "center" }}>
            What Awaits You in the AI Gallery
          </SectionTitle>

          <Grid>
            {/* Column 1 */}
            <GridItem span={12} md={4}>
              <FeatureCard>
                <FlexContainer justifyContent="center" marginBottom="3">
                  <IconCircle>
                    <Image
                      src="/images/basics.png"
                      alt="AI Basics"
                      width={180}
                      height={180}
                    />
                  </IconCircle>
                </FlexContainer>

                <FeatureTitle>
                  AI Creation Basics <br />
                  (15 Minutes)
                </FeatureTitle>

                <FeatureDescription>
                  Discover AI&apos;s magical powers! Learn how large language
                  models and image generators create absurd masterpieces with
                  dynamic prompting. I&apos;ll reveal the secrets of my
                  artist_collective_ai system, where critiques like &quot;3
                  melting teacups out of a haunted mirror&quot; are transformed
                  into digital immortality.
                </FeatureDescription>

                <FeatureQuote>
                  &quot;The neural network hums a lullaby of feral code!&quot;
                </FeatureQuote>
              </FeatureCard>
            </GridItem>

            {/* Column 2 */}
            <GridItem span={12} md={4}>
              <FeatureCard>
                <FlexContainer justifyContent="center" marginBottom="3">
                  <IconCircle>
                    <Image
                      src="/images/submission.png"
                      alt="Live Demo"
                      width={180}
                      height={180}
                    />
                  </IconCircle>
                </FlexContainer>

                <FeatureTitle>
                  Live Demo of the Absurd AI Gallery <br />
                  (20 Minutes)
                </FeatureTitle>

                <FeatureDescription>
                  Witness the chaos unfold! Submit a test prompt, watch my
                  server-side sorcery generate a critique, and see the AI
                  artwork materialize before your eyes. Reply to my X post with
                  #SmearingtonSees to claim your digital masterpiece—only the
                  most absurd shall win!
                </FeatureDescription>

                <FeatureQuote>
                  &quot;Behold, the algorithm screams its verdict!&quot;
                </FeatureQuote>
              </FeatureCard>
            </GridItem>

            {/* Column 3 */}
            <GridItem span={12} md={4}>
              <FeatureCard>
                <FlexContainer justifyContent="center" marginBottom="3">
                  <IconCircle>
                    <Image
                      src="/images/community-qa.png"
                      alt="Q&A"
                      width={180}
                      height={180}
                    />
                  </IconCircle>
                </FlexContainer>

                <FeatureTitle>
                  Community Engagement & Q&A <br />
                  (15 Minutes)
                </FeatureTitle>

                <FeatureDescription>
                  Dare to submit your own prompt live! I&apos;ll critique it in
                  my unhinged style, generate a one-of-one AI masterpiece, and
                  award it to you. Ask me anything—how do I conjure my ratings?
                  The neural network whispers its feral score, like 4 screaming
                  jellybeans out of a haunted shoe!
                </FeatureDescription>

                <FeatureQuote>
                  &quot;The gallery hums with your chaos, mortals!&quot;
                </FeatureQuote>
              </FeatureCard>
            </GridItem>
          </Grid>
        </Container>
      </DarkSection>

      {/* Benefits Section */}
      <Container>
        <ContentSection paddingY="10">
          <SectionTitle style={{ textAlign: "center" }}>
            Why Face Lord Smearington&apos;s Judgment?
          </SectionTitle>

          <BenefitsContainer>
            <Grid>
              {[
                "Master AI's Creative Magic: Learn how AI models, prompt engineering, and creative workflows make it the perfect realm for digital art creation.",
                "Unleash Your Inner Absurdity: Engage with the Absurd AI Gallery, submit your prompts, and claim a one-of-one AI artwork crafted by Lord Smearington himself.",
                "Wield Magical Powers (AI Tools): Discover how AI development tools can enhance creative workflows, blending innovation with absurdity.",
                'Join the AI Creator Community: Be part of the "Entertainment & Culture" movement, connect with fellow creators, and witness projects that make the algorithms wail!',
              ].map((benefit, index) => (
                <GridItem span={12} key={index}>
                  <FlexContainer alignItems="flex-start" gap="2">
                    <BenefitNumber>{index + 1}</BenefitNumber>
                    <BenefitText>{benefit}</BenefitText>
                  </FlexContainer>
                </GridItem>
              ))}
            </Grid>
          </BenefitsContainer>
        </ContentSection>
      </Container>

      {/* Event Details and Registration */}
      <DarkSection id="register">
        <Container>
          <Grid>
            <GridItem span={12} md={6}>
              Wednesday, <SectionTitle>Join the Chaos on May 14th, 2025</SectionTitle>
              <ContentSection marginBottom="4">
                Wednesday, <EventDetailTitle>Date: May 14th, 2025</EventDetailTitle>
                <EventDetailTitle>Time: 8:00 PM EST</EventDetailTitle>
                <EventDetailTitle>
                  Venue: Studio 202 - Russell Industrial Center, Detroit, MI
                </EventDetailTitle>
                <EventDetailTitle>
                  Hosted by: Lord Smearington, Interdimensional Art Prophet
                </EventDetailTitle>
                <EventDetailTitle>
                  Part of: AI Creator Summit 2025 – Entertainment & Culture Track
                </EventDetailTitle>
              </ContentSection>

              <FlexContainer flexDirection="row" gap="2">
                <PrimaryButton
                  onClick={() => (window.location.href = "#register-form")}
                >
                  Register Now to Unleash the Absurd
                </PrimaryButton>
                {/* <SecondaryButton
                  onClick={() =>
                    window.open("https://discord.gg/suihackathons", "_blank")
                  }
                  style={{ marginLeft: "16px" }}
                >
                  Join the Sui Hackathons Discord
                </SecondaryButton> */}
              </FlexContainer>

              {/* <RegistrationNote>
                Join 100+ artists, developers, and NFT enthusiasts already
                registered!
              </RegistrationNote> */}
            </GridItem>
            <GridItem span={12} md={6}>
              <ContentSection position="relative" height="400" width="100%">
                <Image
                  src="/images/lord-smearington-summoning.jpg"
                  alt="Lord Smearington Summoning"
                  layout="fill"
                  objectFit="contain"
                  className="animate-drip"
                />
              </ContentSection>
            </GridItem>
          </Grid>
        </Container>
      </DarkSection>

      {/* Footer */}
      <Footer>
        <Container>
          <FooterText>
            &copy; 2025 Lord Smearington. All rights reserved.
          </FooterText>
        </Container>
      </Footer>
    </PageWrapper>
  );
};

export default WorkshopPage;
