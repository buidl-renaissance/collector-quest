import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import {
  FaDungeon,
  FaDice,
  FaScroll,
  FaBook,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

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

const MasterPage: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.scrollY * 0.3);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // Audio implementation would go here
  };

  return (
    <PageWrapper>
      <ParallaxBackground style={{ transform: `translateY(${parallaxOffset}px)` }} />
      
      {/* {[...Array(5)].map((_, i) => (
        <FloatingObject
          key={i}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {i % 3 === 0 ? <FaDungeon /> : <FaDice />}
        </FloatingObject>
      ))} */}

      <AudioToggle onClick={toggleAudio}>
        {audioEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
      </AudioToggle>

      <Container>
        <HeroSection>
          <Title>
            <MagicSpan>Collector Quest</MagicSpan>
          </Title>
          <Subtitle>Forge your legacy. Collect the extraordinary.</Subtitle>
          <Quote>
            &quot;In every whisper of wind, a quest awaits. But only those who
            dare to collect them will be remembered.&quot;
          </Quote>
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
          <SectionIcon>
            <FaScroll />
          </SectionIcon>
          <SectionTitle>What Is Collector Quest?</SectionTitle>
          <Description>
            Collector Quest is a turn-based storytelling game powered by AI. You
            create a hero—I craft the world. Together, we forge one-of-a-kind
            adventures that you can save, share, and collect.
          </Description>
          <Tagline>
            No dice. No downloads. Just imagination and consequence.
          </Tagline>
        </Section>

        {/* <PartySection>
          <SectionTitle>The Party</SectionTitle>
          <CharacterCards>
            <CharacterCard>
              <CardIcon><FaUserAlt /></CardIcon>
              <CardTitle>Collector</CardTitle>
              <CardDescription>Gather relics and tales from across the realms.</CardDescription>
              <CardCTA>Join</CardCTA>
            </CharacterCard>
            <CharacterCard>
              <CardIcon><FaBook /></CardIcon>
              <CardTitle>Archivist</CardTitle>
              <CardDescription>Record and preserve the legends of old.</CardDescription>
              <CardCTA>Join</CardCTA>
            </CharacterCard>
            <CharacterCard>
              <CardIcon><FaDice /></CardIcon>
              <CardTitle>Alchemist</CardTitle>
              <CardDescription>Transform ordinary quests into extraordinary adventures.</CardDescription>
              <CardCTA>Join</CardCTA>
            </CharacterCard>
            <CharacterCard>
              <CardIcon><FaScroll /></CardIcon>
              <CardTitle>Seeker</CardTitle>
              <CardDescription>Uncover hidden truths and forgotten lore.</CardDescription>
              <CardCTA>Join</CardCTA>
            </CharacterCard>
          </CharacterCards>
        </PartySection> */}

        <Section>
          <SectionIcon>
            <FaDice />
          </SectionIcon>
          <SectionTitle>The World Responds to You</SectionTitle>
          <Description>
            Based on your character, I summon the perfect beginning: a burning
            village, a cursed temple, a dream you can&apos;t escape…
          </Description>
          <Description>
            Each turn, you choose an action. I, your <b>COLLECTOR Master</b>,
            answer with unfolding story, chance, and challenge.
          </Description>
          <Quote>
            &quot;You step into the overgrown amphitheater. A single note echoes
            from the shadows…&quot;
          </Quote>
        </Section>

        <Section>
          <SectionIcon>
            <FaBook />
          </SectionIcon>
          <SectionTitle>Collect the Quests You Survive</SectionTitle>
          <Description>
            Every completed adventure is added to your Tome of Legends—a growing
            library of past glories, failures, and discoveries.
          </Description>
          <FeatureList>
            <FeatureItem>Replay quests</FeatureItem>
            <FeatureItem>Share storybooks with friends</FeatureItem>
            <FeatureItem>
              Unlock badges and world secrets as your collection grows
            </FeatureItem>
          </FeatureList>
          <Tagline>The more you quest, the deeper the lore.</Tagline>
        </Section>

        <DiscoverSection>
          <SectionTitle>What You&apos;ll Discover</SectionTitle>
          <CollectiblesGrid>
            <CollectibleItem>
              <CollectibleIcon><FaScroll /></CollectibleIcon>
              <CollectibleTitle>Digital Relics</CollectibleTitle>
              <CollectibleDescription>Unique artifacts with mystical properties</CollectibleDescription>
            </CollectibleItem>
            <CollectibleItem>
              <CollectibleIcon><FaDungeon /></CollectibleIcon>
              <CollectibleTitle>Quests</CollectibleTitle>
              <CollectibleDescription>Adventures that shape your legacy</CollectibleDescription>
            </CollectibleItem>
            <CollectibleItem>
              <CollectibleIcon><FaBook /></CollectibleIcon>
              <CollectibleTitle>Guild Halls</CollectibleTitle>
              <CollectibleDescription>Sanctuaries for like-minded adventurers</CollectibleDescription>
            </CollectibleItem>
            <CollectibleItem>
              <CollectibleIcon><FaDice /></CollectibleIcon>
              <CollectibleTitle>Enchanted Items</CollectibleTitle>
              <CollectibleDescription>Tools to aid your journey</CollectibleDescription>
            </CollectibleItem>
          </CollectiblesGrid>
        </DiscoverSection>

        {showMore && (
          <>
            <Section>
              <SectionTitle>How It Works</SectionTitle>
              <FeatureList>
                <FeatureItem>
                  One input per turn: type or select your action
                </FeatureItem>
                <FeatureItem>
                  I handle all outcomes behind the scenes (yes, even the dice)
                </FeatureItem>
                <FeatureItem>
                  Random encounters, loot, and plot twists await
                </FeatureItem>
                <FeatureItem>
                  Game auto-saves your progress and stats
                </FeatureItem>
              </FeatureList>
            </Section>

            <Section>
              <SectionTitle>Play Alone or In a Party (Soon!)</SectionTitle>
              <Description>
                Quests are yours to shape—but future updates shall open the
                gates to co-op storytelling. Forge a party. Split the treasure.
                Or betray your friends. I won&apos;t judge.
              </Description>
            </Section>

            <Section>
              <SectionTitle>Why Collector Quest?</SectionTitle>
              <FeatureList>
                <FeatureItem>
                  AI-powered <b>COLLECTOR Master</b> with infinite patience
                </FeatureItem>
                <FeatureItem>Play instantly—no setup, no rules</FeatureItem>
                <FeatureItem>
                  Personalized storylines and dynamic quests
                </FeatureItem>
                <FeatureItem>
                  Save your journeys and collect them all
                </FeatureItem>
              </FeatureList>
            </Section>
          </>
        )}

        {!showMore && (
          <ShowMoreButton onClick={() => setShowMore(true)}>
            Show More Details
          </ShowMoreButton>
        )}

        <ChronicleSection>
          <SectionTitle>Chronicle Scroll</SectionTitle>
          <ScrollParchment>
            <ScrollEntry>
              <ScrollDate>Today</ScrollDate>
              <ScrollText>Adventurer Elric discovered the Amulet of Whispers in the Forgotten Caverns</ScrollText>
            </ScrollEntry>
            <ScrollEntry>
              <ScrollDate>Yesterday</ScrollDate>
              <ScrollText>The Guild of Seekers completed their 100th quest</ScrollText>
            </ScrollEntry>
            <ScrollEntry>
              <ScrollDate>3 days ago</ScrollDate>
              <ScrollText>A new realm opened: The Shattered Isles await brave explorers</ScrollText>
            </ScrollEntry>
          </ScrollParchment>
        </ChronicleSection>

        <VideoSection>
          <VideoContainer>
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/images/COLLECTOR-quest-intro.png"
            >
              <source
                src="/videos/COLLECTOR-quest-intro.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <VideoOverlay>
              <PlayButton href="/character/race">
                <span>PRESS START</span>
              </PlayButton>
            </VideoOverlay>
          </VideoContainer>
        </VideoSection>

        {/* <StartAdventureButton href="/story/quest">
          Begin Your Quest <FaArrowRight />
        </StartAdventureButton> */}

        <FounderBadge>
          <BadgeIcon><FaScroll /></BadgeIcon>
          <BadgeText>Founding Relic Bearer</BadgeText>
        </FounderBadge>
      </Container>

      <Footer>
        <FooterCastle />
        <FooterText>Generated by Escada Gordon & WiredInSamurai</FooterText>
        <FooterLinks>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/terms">Terms</FooterLink>
          <FooterLink href="/socials">Socials</FooterLink>
        </FooterLinks>
      </Footer>
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
  background-image: url('/images/parchment-texture.jpg');
  background-size: cover;
  opacity: 0.05;
  z-index: 1;
`;

const AudioToggle = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(58, 38, 6, 0.7);
  border: 1px solid #bb8930;
  color: #bb8930;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(187, 137, 48, 0.2);
    transform: scale(1.1);
  }
`;

const FloatingObject = styled.div`
  position: absolute;
  font-size: 1.5rem;
  color: rgba(187, 137, 48, 0.2);
  z-index: 1;
  animation: ${float} 6s infinite ease-in-out;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  position: relative;
  z-index: 2;

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
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 1rem 0;
`;

const VideoSection = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin-bottom: 2rem;
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const PlayButton = styled(Link)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: none;
  border: none;
  color: #bb8930;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${glow} 3s infinite ease-in-out;
  text-decoration: none;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const Quote = styled.blockquote`
  font-style: italic;
  color: #bb8930;
  font-size: 1.1rem;
  margin: 1.5rem 0;
  padding: 0 1rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${glow} 3s infinite ease-in-out;

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: rgba(58, 38, 6, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(187, 137, 48, 0.3);

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const DiscoverSection = styled(Section)`
  background: rgba(58, 38, 6, 0.7);
`;

const CollectiblesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const CollectibleItem = styled.div`
  background: rgba(187, 137, 48, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.05);
    background: rgba(187, 137, 48, 0.2);
  }
`;

const CollectibleIcon = styled.div`
  font-size: 1.8rem;
  color: #b6551c;
  margin: 0 auto;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CollectibleTitle = styled.h4`
  font-size: 1rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
`;

const CollectibleDescription = styled.p`
  font-size: 0.8rem;
`;

const ChronicleSection = styled(Section)`
  background-image: url('/images/parchment-texture.jpg');
  background-size: cover;
  background-blend-mode: overlay;
  background-color: rgba(58, 38, 6, 0.8);
`;

const ScrollParchment = styled.div`
  background: rgba(187, 137, 48, 0.1);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(58, 38, 6, 0.3);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #bb8930;
    border-radius: 4px;
  }
`;

const ScrollEntry = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(187, 137, 48, 0.3);
  animation: ${unfurl} 0.5s ease-out;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ScrollDate = styled.div`
  font-size: 0.8rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
  font-style: italic;
`;

const ScrollText = styled.p`
  font-size: 1rem;
`;

const SectionIcon = styled.div`
  font-size: 1.8rem;
  color: #bb8930;
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
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

const FeatureList = styled.ul`
  margin: 1rem 0;
  padding-left: 1.5rem;
`;

const FeatureItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const ShowMoreButton = styled.button`
  background: transparent;
  border: 1px solid #bb8930;
  color: #bb8930;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: block;
  margin: 2rem auto;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(187, 137, 48, 0.1);
  }
`;

const StartAdventureButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #9f3515, #b6551c);
  color: #e6e6e6;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.2rem;
  text-decoration: none;
  margin: 3rem auto 1rem;
  max-width: 300px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(182, 85, 28, 0.3);
  font-family: "Cinzel", serif;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(187, 137, 48, 0.5);
    background: linear-gradient(90deg, #b6551c, #9f3515);
  }
`;

const FounderBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(27, 58, 84, 0.2);
  border: 1px solid #1b3a54;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin: 2rem auto;
  max-width: fit-content;
`;

const BadgeIcon = styled.div`
  color: #bb8930;
  font-size: 1rem;
`;

const BadgeText = styled.span`
  color: #bb8930;
  font-size: 0.9rem;
  font-family: "Cinzel", serif;
`;

const Footer = styled.footer`
  background: #3a2606;
  padding: 2rem 1rem;
  text-align: center;
  position: relative;
`;

const FooterCastle = styled.div`
  height: 50px;
  background-image: url('/images/castle-silhouette.png');
  background-repeat: repeat-x;
  background-position: center bottom;
  margin-bottom: 1rem;
`;

const FooterText = styled.p`
  color: #4a3f30;
  margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #bb8930;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #b6551c;
    text-decoration: underline;
  }
`;

export default MasterPage;
