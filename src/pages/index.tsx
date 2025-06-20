import React, { useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaDungeon,
  FaDice,
  FaScroll,
  FaBook,
  FaShareAlt,
  FaTimes,
  FaTwitter,
  FaFacebook,
  FaLink,
} from "react-icons/fa";
import Footer from "@/components/Footer";
import QRCode from "react-qr-code";
import useIsAdmin from "@/hooks/useIsAdmin";
import { NextButton } from "@/components/styled/buttons";
import router from "next/router";
import PressStart from "@/components/PressStart";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { FeaturedDescription, FeaturedGrid, FeaturedIcon, FeaturedItem, FeaturedSection, FeaturedTitle } from "@/components/styled/section";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      metadata: {
        title: `Collector Quest | A Turn-Based AI Dungeon Game`,
        description:
          "Embark on infinite adventures in this turn-based AI storytelling game. Create a hero, forge unique quests, and build your collection of legendary tales.",
        image: "/images/collector-quest-banner.jpg",
        url: `https://collectorquest.theethical.ai`,
      },
    },
  };
};

const IndexPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { character } = useCurrentCharacter();
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const { isAdmin } = useIsAdmin();
  const preRegisterRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.scrollY * 0.3);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowShareModal(false);
      }
    };

    if (showShareModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareModal]);

  const scrollToPreRegister = () => {
    const yOffset = -20;
    const element = preRegisterRef.current;
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to pre-register");
      }

      // Save email to localStorage
      localStorage.setItem("preRegisteredEmail", email);
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to register. Please try again later."
      );
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("https://collectorquest.ai");
    alert("Link copied to clipboard!");
  };

  return (
    <PageWrapper>
      <ParallaxBackground
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />

      <Container>
        <HeroSection>
          <Title>
            <MagicSpan>Collector Quest</MagicSpan>
          </Title>
          <Subtitle>Forge your legacy. Collect the extraordinary.</Subtitle>
          {/* <ComingSoonBadge onClick={scrollToPreRegister}>
            Coming Soon
          </ComingSoonBadge> */}
        </HeroSection>

        <ImageSection>
          <ImageContainer>
            <Image
              src="/images/COLLECTOR-Master-Card.png"
              alt="Collector Quest"
            />
          </ImageContainer>
        </ImageSection>

        <Section>
            {/* <SectionIcon>
              <FaScroll />
            </SectionIcon> */}
          <SectionTitle>What Is Collector Quest?</SectionTitle>
          <Description>
            Collector Quest is a turn-based Alternate Reality Game (ARG) powered by AI. You
            create a hero—I craft the world. Together, we forge one-of-a-kind
            adventures that you can save, share, and collect.
          </Description>
          <Tagline>
            No dice. No downloads. Just imagination and consequence.
          </Tagline>
        </Section>

        {/* <PreRegisterSection ref={preRegisterRef}>
          <SectionIcon>
            <FaBook />
          </SectionIcon>
          <SectionTitle>Be The First To Know</SectionTitle>
          <Description>
            Join our wait-list to receive early access and exclusive updates
            about Collector Quest.
          </Description>

          {!isSubmitted ? (
            <PreRegisterForm onSubmit={handleSubmit}>
              <PreRegisterInput
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <PreRegisterButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner /> : "Pre-Register"}
              </PreRegisterButton>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </PreRegisterForm>
          ) : (
            <SuccessMessage>
              <SectionIcon>
                <FaDice />
              </SectionIcon>
              Thank you for registering! We&apos;ll notify you when Collector
              Quest launches.
            </SuccessMessage>
          )}
        </PreRegisterSection> */}

        <FeaturedSection>
          <FeaturedGrid>
            <FeaturedItem>
              <FeaturedIcon>
                <FaDungeon />
              </FeaturedIcon>
              <FeaturedTitle>Infinite Adventures</FeaturedTitle>
              <FeaturedDescription>
                Every quest is uniquely crafted for your character
              </FeaturedDescription>
            </FeaturedItem>
            <FeaturedItem>
              <FeaturedIcon>
                <FaDice />
              </FeaturedIcon>
              <FeaturedTitle>Dynamic Storytelling</FeaturedTitle>
              <FeaturedDescription>
                Your choices shape the narrative and consequences
              </FeaturedDescription>
            </FeaturedItem>
            <FeaturedItem>
              <FeaturedIcon>
                <FaScroll />
              </FeaturedIcon>
              <FeaturedTitle>Collectible Quests</FeaturedTitle>
              <FeaturedDescription>
                Build your library of completed adventures
              </FeaturedDescription>
            </FeaturedItem>
            <FeaturedItem>
              <FeaturedIcon>
                <FaBook />
              </FeaturedIcon>
              <FeaturedTitle>Growing World</FeaturedTitle>
              <FeaturedDescription>
                Discover new realms, items, and characters
              </FeaturedDescription>
            </FeaturedItem>
          </FeaturedGrid>
        </FeaturedSection>

        <Section>
          {/* <SectionIcon>
            <FaShareAlt />
          </SectionIcon> */}
          <SectionTitle>Real-World Artifacts</SectionTitle>
          <Description>
            Turn your artwork into legendary digital relics. Each piece becomes a unique artifact with mystical powers.
          </Description>
          <FeaturedGrid>
            <FeaturedItem>
              <FeaturedTitle>Register Art</FeaturedTitle>
              <FeaturedDescription>
                Transform your artwork into a digital relic
              </FeaturedDescription>
            </FeaturedItem>
            <FeaturedItem>
              <FeaturedTitle>Magical Powers</FeaturedTitle>
              <FeaturedDescription>
                Each artifact gains unique mystical abilities
              </FeaturedDescription>
            </FeaturedItem>
            <FeaturedItem>
              <FeaturedTitle>Verified Collection</FeaturedTitle>
              <FeaturedDescription>
                Build a collection of authentic digital relics
              </FeaturedDescription>
            </FeaturedItem>
            <FeaturedItem>
              <FeaturedTitle>Live Forever</FeaturedTitle>
              <FeaturedDescription>
                Your art becomes a legendary game artifact
              </FeaturedDescription>
            </FeaturedItem>
          </FeaturedGrid>
          <Tagline>Where art becomes legend.</Tagline>
        </Section>

        <PressStart />
        {/* A Section for Artists to Register their Artifacts */}
        {isAdmin && (
          <>
            {/* <Section>
              <SectionTitle>Register An Artifact</SectionTitle>
              <Description>
                Are you an artist? Register an artifact to receive a
                one-of-a-kind relic based on your artwork.
              </Description>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <NextButton onClick={() => router.push("/artifacts/create")}>
                  REGISTER ARTIFACT
                </NextButton>
              </div>
            </Section> */}
          </>
        )}

        {isAdmin && (
          <QRCodeSection>
            <QRCode
              value="https://collectorquest.ai"
              bgColor="#bb8930"
              fgColor="#b6551c99"
              size={288}
            />
          </QRCodeSection>
        )}

        {isAdmin && character && (
          <Section>
            <SectionTitle>View Characters</SectionTitle>
            <Description>
              View your characters and their adventures.
            </Description>
            <NextButton onClick={() => router.push("/characters")}>
              View Characters
            </NextButton>
          </Section>
        )}

        {/* <FounderBadge>
          <BadgeIcon><FaScroll /></BadgeIcon>
          <BadgeText>Founding Relic Bearer</BadgeText>
        </FounderBadge> */}
      </Container>

      {showShareModal && (
        <ModalOverlay>
          <ModalContent ref={modalRef}>
            <ModalHeader>
              <ModalTitle>Share Collector Quest</ModalTitle>
              <CloseButton onClick={() => setShowShareModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <QRCodeContainer>
                <QRCode value="https://collectorquest.ai" size={150} />
              </QRCodeContainer>
              <ShareText>Scan this QR code or share via:</ShareText>
              <ShareOptions>
                <ShareOption
                  href="https://twitter.com/intent/tweet?text=Check%20out%20Collector%20Quest%20-%20a%20turn-based%20AI%20storytelling%20game!&url=https://collectorquest.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="#1DA1F2"
                >
                  <FaTwitter /> Twitter
                </ShareOption>
                <ShareOption
                  href="https://www.facebook.com/sharer/sharer.php?u=https://collectorquest.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="#4267B2"
                >
                  <FaFacebook /> Facebook
                </ShareOption>
                <ShareOption
                  as="button"
                  onClick={copyToClipboard}
                  color="#bb8930"
                >
                  <FaLink /> Copy Link
                </ShareOption>
              </ShareOptions>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      <Footer />
    </PageWrapper>
  );
};

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 10px rgba(108, 73, 7, 0.5); }
  50% { text-shadow: 0 0 20px rgba(187, 137, 48, 0.8), 0 0 30px rgba(182, 85, 28, 0.6); }
  100% { text-shadow: 0 0 10px rgba(108, 73, 7, 0.5); }
`;

const unfurl = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(58, 38, 6, 0.9) 0%,
    rgba(108, 58, 20, 0.9) 50%,
    rgba(58, 38, 6, 0.9) 100%
  );
  color: #e6e6e6;
  position: relative;
  overflow: hidden;
  overflow-x: hidden;
  font-family: "EB Garamond", "Merriweather", serif;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/images/collector-quest-background.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.15;
    z-index: 0;
  }
`;

const ParallaxBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/images/parchment-texture.jpg");
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
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const ImageSection = styled.div`
  margin-bottom: 3rem;
  padding: 1rem 0;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-height: 64vh;
  object-fit: contain;
  max-width: 100%;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 1rem 0;
`;

const ComingSoonBadge = styled.div`
  display: inline-block;
  background: linear-gradient(90deg, #b6551c, #bb8930);
  color: #fff;
  font-family: "Cinzel", serif;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  margin: 1.5rem auto;
  font-size: 1.2rem;
  font-weight: bold;
  animation: ${pulse} 2s infinite ease-in-out;
  box-shadow: 0 0 15px rgba(182, 85, 28, 0.5);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-family: "Cinzel Decorative", "Uncial Antiqua", serif;
  margin-bottom: 1rem;

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

const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: normal;
  margin-bottom: 1.5rem;
  color: #bb8930;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: rgba(58, 38, 6, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(187, 137, 48, 0.3);
  font-family: "Cinzel", serif;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #b6551c;
  margin-bottom: 1rem;
  font-family: "Cinzel Decorative", "Uncial Antiqua", serif;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Tagline = styled.p`
  font-weight: bold;
  color: #bb8930;
  font-size: 1.1rem;
  margin: 1rem 0;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const QRCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: rgba(58, 38, 6, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(187, 137, 48, 0.3);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${unfurl} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: linear-gradient(
    135deg,
    rgba(58, 38, 6, 0.95) 0%,
    rgba(108, 58, 20, 0.95) 100%
  );
  border: 2px solid #bb8930;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(187, 137, 48, 0.3);
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #bb8930;
  font-family: "Cinzel", serif;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #e6e6e6;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #bb8930;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  width: fit-content;
  margin: 0 auto 1.5rem;
`;

const ShareText = styled.p`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #e6e6e6;
`;

const ShareOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const ShareOption = styled.a<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.color};
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-family: "Cinzel", serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
`;

export default IndexPage;
