import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { keyframes } from '@emotion/react';
// import { VideoPlayer } from './Video';

const Events: React.FC = () => {
  return (
    <EventsGrid>
      {/* <EventCard>
        <EventImage src="/images/ai-creator-workshop.png" alt="AI Creator Workshop with Lord Smearington" />
        <EventContent>
          <EventDate>Wednesday, May 7th & 14th, 2025</EventDate>
          <EventTitle>Embracing the Absurd: AI Creator Workshop</EventTitle>
          <EventDescription>
            Join Lord Smearington for a workshop on AI tools, creative prompting, and embracing the absurd.
          </EventDescription>
          <EventButton href="/events/ai-creator-workshop">Learn More</EventButton>
        </EventContent>
      </EventCard> */}
      
      <EventCard>
        <EventImage src="/images/lord-smearington.jpg" alt="Interdimensional Art Gallery with Lord Smearington" />
        {/* <VideoPlayer
          src="/videos/lord-smearington-welcomes.mp4"
          poster="/videos/lord-smearington-poster.jpg"
          autoPlay={true}
          loop={true}
          muted={true}
        /> */}
        <EventContent>
          <EventDate>Opening Saturday, May 17th, 2025</EventDate>
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
  );
};

const EventsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
  width: 100%;
`;


const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.2);
  background-color: #3B4C99;
  width: 100%;
  display: flex;
  flex-direction: row;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 215, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EventImage = styled.img`
  width: 40%;
  height: auto;
  object-fit: cover;
  border-right: 2px solid #FFD700;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 340px;
    border-right: none;
    border-bottom: 2px solid #FFD700;
  }
`;

const EventContent = styled.div`
  padding: 1rem;
  flex: 1;
`;

const EventDate = styled.div`
  display: inline-block;
  background: #481790;
  color: #C7BFD4;
  /* background: #C7BFD4;
  color: #5A3E85; */
  
  padding: 0.3rem 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-left: 3px solid #FFD700;
  font-family: 'Cinzel', serif;
`;

const EventTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
  font-family: 'Playfair Display SC', serif;
`;

const EventDescription = styled.p`
  font-size: 1.1rem;
  color: #C7BFD4;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const EventButton = styled(Link)`
  background: linear-gradient(135deg, #2A3A87, #481790);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid #FFD700;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  display: inline-block;
  
  &:hover {
    transform: translateY(-5px);
    background: #481790;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
    color: #FFD700;
  }

  @media (max-width: 768px) {
    display: block;
    width: 100%;
  }
`;


const ComingSoonCard = styled.div`
  background: rgba(90, 62, 133, 0.2);
  border: 2px dashed #FFD700;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const ComingSoonIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${float} 6s infinite ease-in-out;
`;

const ComingSoonTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #FFFFFF;
  font-family: 'Playfair Display SC', serif;
`;

const ComingSoonText = styled.p`
  font-size: 1.1rem;
  color: #C7BFD4;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

export default Events;