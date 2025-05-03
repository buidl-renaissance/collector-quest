import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import Head from 'next/head';

const EventsPage = () => {
  return (
    <Container>
      <Head>
        <title>Events | Lord Smearington&apos;s Realm</title>
        <meta name="description" content="Join us for upcoming events at Lord Smearington's Realm. Connect with our community both online and in-person." />
      </Head>
      
      <PageBackground />
      
      {[...Array(8)].map((_, i) => (
        <FloatingElement 
          key={i}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          size={`${Math.random() * 50 + 20}px`}
          animationDuration={`${Math.random() * 10 + 5}s`}
        />
      ))}
      
      <Header>
        <HeaderTitle>UPCOMING EVENTS</HeaderTitle>
        <HeaderSubtitle>
          Connect with our community online and in-person
        </HeaderSubtitle>
      </Header>
      
      <ContentWrapper>
        <EventsGrid>
          <EventCard>
            <EventImage src="/images/art-night-spot-lite-vol-08.jpg" alt="Art Night Detroit x Spotlite Vol. 08" />
            <EventContent>
              <EventDate>Wednesday, April 30th, 2025</EventDate>
              <EventTitle>Art Night Detroit x Spotlite Vol. 08</EventTitle>
              <EventDescription>
                Join us for a night of creativity, art showcase, live music, and community building.
              </EventDescription>
              <EventButton href="/events/art-night-spot-lite-vol8">Learn More</EventButton>
            </EventContent>
          </EventCard>
          
          {/* <EventCard>
            <EventImage src="/images/lord-smearington.jpg" alt="Sui Developer Workshop with Lord Smearington" />
            <EventContent>
              <EventDate>Tuesday, May 6th, 2025</EventDate>
              <EventTitle>Sui Developer Workshop</EventTitle>
              <EventDescription>
                Join Lord Smearington for a workshop on Sui development.
              </EventDescription>
              <EventButton href="/events/sui-developer-workshop">Learn More</EventButton>
            </EventContent>
          </EventCard> */}

          <EventCard>
            <EventImage src="/images/ai-creator-workshop.png" alt="AI Creator Workshop with Lord Smearington" />
            <EventContent>
              <EventDate>Wednesday, May 14th, 2025</EventDate>
              <EventTitle>Embracing the Absurd: AI Creator Workshop</EventTitle>
              <EventDescription>
                Join Lord Smearington for a workshop on AI tools, creative prompting, and embracing the absurd.
              </EventDescription>
              <EventButton href="/events/ai-creator-workshop">Learn More</EventButton>
            </EventContent>
          </EventCard>
          
          <EventCard>
            <EventImage src="/images/lord-smearington.jpg" alt="Interdimensional Art Gallery with Lord Smearington" />
            <EventContent>
              <EventDate>Opening Saturday, May 17th - ???, 2025</EventDate>
              <EventTitle>Unleashing the Absurd: An Interdimensional Art Gallery Experience presented by Lord Smearington</EventTitle>
              <EventDescription>
                Join Lord Smearington for a first of it&apos;s kind interdimensional art gallery experience.
              </EventDescription>
              <EventButton href="/events/unleashing-the-absurd">Learn More</EventButton>
            </EventContent>
          </EventCard>
          
          <ComingSoonCard>
            <ComingSoonIcon>📅</ComingSoonIcon>
            <ComingSoonTitle>More Events Coming Soon</ComingSoonTitle>
            <ComingSoonText>
              We&apos;re planning more exciting events both online and in-person. 
              Join our Discord to stay updated!
            </ComingSoonText>
            <EventButton href="https://discord.gg/kSuS9kdgTk" target="_blank">Join Discord</EventButton>
          </ComingSoonCard>
        </EventsGrid>
        
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

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #0A0A23;
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const PageBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0A0A23;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  z-index: -2;
`;

const FloatingElement = styled.div<{ top: string; left: string; size: string; animationDuration: string }>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 215, 0, 0.05));
  border-radius: 50%;
  z-index: -1;
  animation: ${float} ${props => props.animationDuration} infinite ease-in-out;
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
    background: #FF0000;
    mask-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='%23FF0000' stroke-width='4' stroke-dasharray='6, 14' stroke-dashoffset='0' stroke-linecap='square'/%3E%3C/svg%3E");
  }
`;

const HeaderTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #FF0000, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
  
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

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 340px;
  object-fit: cover;
  border-bottom: 2px solid #FF0000;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventDate = styled.div`
  display: inline-block;
  background: #0033FF;
  color: white;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
`;

const EventDescription = styled.p`
  font-size: 1rem;
  color: #CCCCCC;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const EventButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #FF0000, #FF6B00);
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const ComingSoonCard = styled.div`
  background: rgba(0, 51, 255, 0.1);
  border: 2px dashed #0033FF;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ComingSoonIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ComingSoonTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
`;

const ComingSoonText = styled.p`
  font-size: 1rem;
  color: #CCCCCC;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(to right, rgba(255, 0, 0, 0.1), rgba(0, 51, 255, 0.1));
  border-radius: 8px;
  margin-bottom: 3rem;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  color: #CCCCCC;
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
  background: linear-gradient(135deg, #FF0000, #FF6B00);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
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
  border: 2px solid #FF0000;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 0, 0, 0.1);
  }
`;

const Footer = styled.footer`
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterText = styled.p`
  color: #CCCCCC;
  font-size: 0.9rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #CCCCCC;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #FFFFFF;
  }
`;
