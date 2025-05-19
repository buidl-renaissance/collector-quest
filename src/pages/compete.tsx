import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaCrown, FaUsers, FaTrophy, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
const CompetePage = () => {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <HeroSection>
        <ContainerDiv>
          <HeroContent>
            <Title>Enter the Realm of Collector Quest</Title>
            <Subtitle>Team up. Quest hard. Win $1,000.</Subtitle>
            <Description>Recruit a team of four, complete quests, and battle for glory and gold.</Description>
            <ActionButton>Join the Quest</ActionButton>
          </HeroContent>
        </ContainerDiv>
      </HeroSection>

      {/* How It Works */}
      <Section>
        <ContainerDiv>
          <SectionTitle>
              <span>How It Works</span>
          </SectionTitle>
          <StepsRow>
            {[
              {
                title: 'Create Your Character',
                description: 'Begin your journey in the world of Collector Quests.',
                icon: <FaCrown />
              },
              {
                title: 'Recruit a Team',
                description: 'Gather three friends or fellow adventurers.',
                icon: <FaUsers />
              },
              {
                title: 'Complete Quests',
                description: 'Unlock new challenges and build your artifact collection.',
                icon: <FaMapMarkerAlt />
              },
              {
                title: 'Compete to Win',
                description: 'Enter the 4v4 showdown and claim your share of the $1,000 prize.',
                icon: <FaTrophy />
              }
            ].map((step, index) => (
              <StepColumn key={index}>
                <StepCard>
                  <StepNumber>{step.icon}</StepNumber>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </StepCard>
              </StepColumn>
            ))}
          </StepsRow>
        </ContainerDiv>
      </Section>

      {/* Competition Details */}
      <Section>
        <ContainerDiv>
          <SectionTitle>
              <span>Competition Details</span>
          </SectionTitle>
          <CompetitionCard>
            <CardTitle>The Ultimate Quest Challenge</CardTitle>
            <DetailsList>
              <DetailItem>
                <DetailLabel>Event:</DetailLabel>
                <DetailValue>Collector Quest Championship</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Launch:</DetailLabel>
                <DetailValue>May 22</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Prize:</DetailLabel>
                <DetailValue>$1,000 for the top team</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Eliminations:</DetailLabel>
                <DetailValue>Memorial Day (May 26), May 28, May 30</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Final Showdown:</DetailLabel>
                <DetailValue>June 1</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Bonus Challenge:</DetailLabel>
                <DetailValue>Verified Real-World Artifacts</DetailValue>
              </DetailItem>
            </DetailsList>
            <Timeline>
              {/* Timeline visualization would go here */}
            </Timeline>
          </CompetitionCard>
        </ContainerDiv>
      </Section>

      {/* Artifact Collection Challenge */}
      <Section>
        <ContainerDiv>
          <SectionTitle>
              <span>Artifact Collection Challenge</span>
          </SectionTitle>
          <InfoText>
            <CardTitle>Art Meets Adventure</CardTitle>
            <Description>Teams can earn bonus points and advance by collecting real-world artworks. Submit physical or digital proof during the competition.</Description>
            <ActionButton secondary>Learn How to Submit Artifacts</ActionButton>
          </InfoText>
        </ContainerDiv>
      </Section>

      {/* Eligibility & Requirements */}
      <Section>
        <ContainerDiv>
          <SectionTitle>
            <span>Eligibility & Requirements</span>
          </SectionTitle>
          <RequirementsList>
            <RequirementItem>Open to all adventurers</RequirementItem>
            <RequirementItem>Must form a team of 4</RequirementItem>
            <RequirementItem>Must complete at least one quest by May 26</RequirementItem>
          </RequirementsList>
        </ContainerDiv>
      </Section>

      {/* FAQ Section */}
      <Section>
        <ContainerDiv>
          <SectionTitle>
            <span>Frequently Asked Questions</span>
          </SectionTitle>
          <FAQContainer>
            {[
              {
                question: 'How do I join?',
                answer: 'Sign up through our platform, create your character, and start forming your team.'
              },
              {
                question: 'What are the quests like?',
                answer: 'Quests range from digital challenges to real-world activities throughout the event.'
              },
              {
                question: 'How do I verify real-world artworks?',
                answer: 'Take photos with the artwork and upload them through our app with location verification.'
              },
              {
                question: 'Can I join without a team?',
                answer: 'Yes! Join our team-matching forum to find other solo questers.'
              },
              {
                question: 'What\'s the deadline for forming a team?',
                answer: 'Teams must be formed by May 25 to participate in the first elimination round.'
              }
            ].map((faq, index) => (
              <FAQItem key={index}>
                <FAQQuestion>{faq.question}</FAQQuestion>
                <FAQAnswer>{faq.answer}</FAQAnswer>
              </FAQItem>
            ))}
          </FAQContainer>
        </ContainerDiv>
      </Section>

      {/* Call to Action */}
      <CTASection>
        <ContainerDiv>
          <Title>Ready to Quest?</Title>
          <Description>Join now, create your character, and begin your journey.</Description>
          <ActionButton>Start My Quest</ActionButton>
        </ContainerDiv>
      </CTASection>

      <Footer />
    </PageWrapper>
  );
};

export default CompetePage;

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(167, 125, 62, 0.5); }
  50% { box-shadow: 0 0 20px rgba(167, 125, 62, 0.8); }
  100% { box-shadow: 0 0 5px rgba(167, 125, 62, 0.5); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #2c1e0e 0%, #4a2c1a 100%);
  color: #fff;
  overflow: hidden;
  font-family: "Cormorant Garamond", serif;
`;

const HeroSection = styled.section`
  padding: 5rem 0;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
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

const ContainerDiv = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #a77d3e;
  text-shadow: 0 0 10px rgba(167, 125, 62, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #bb8930;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const Section = styled.section`
  padding: 4rem 0;
  position: relative;
  
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const StepsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.75rem;
`;

const StepColumn = styled.div`
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 0.75rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 992px) {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  @media (max-width: 576px) {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 600;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  color: #a77d3e;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ActionButton = styled.button<{ secondary?: boolean }>`
  background: ${props => props.secondary ? 'transparent' : 'rgba(167, 125, 62, 0.2)'};
  color: ${props => props.secondary ? '#a77d3e' : '#a77d3e'};
  border: 2px solid #a77d3e;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  
  &:hover {
    background: rgba(167, 125, 62, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(167, 125, 62, 0.4);
  }
  
  &:disabled {
    background-color: #a77d3e;
    cursor: not-allowed;
    transform: none;
  }
`;

const StepCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  height: 100%;
  border: 1px solid rgba(167, 125, 62, 0.3);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(167, 125, 62, 0.3);
  }
`;

const StepNumber = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: rgba(167, 125, 62, 0.2);
  color: #a77d3e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 0.75rem;
  border: 2px solid rgba(167, 125, 62, 0.5);
  animation: ${pulse} 3s ease-in-out infinite;
`;

const StepTitle = styled.h3`
  margin: 0.75rem 0;
  font-weight: 600;
  font-size: 1.4rem;
  color: #a77d3e;
`;

const StepDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

const CompetitionCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(167, 125, 62, 0.3);
`;

const CardTitle = styled.h3`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #a77d3e;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
`;

const DetailsList = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  align-items: center;
  border-bottom: 1px solid rgba(167, 125, 62, 0.2);
  padding-bottom: 0.5rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  width: 150px;
  color: #a77d3e;
`;

const DetailValue = styled.span`
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
`;

const Timeline = styled.div`
  margin-top: 2rem;
  height: 100px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(167, 125, 62, 0.2);
  /* Timeline visualization styling would go here */
`;

const InfoText = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const RequirementsList = styled.ul`
  max-width: 600px;
  margin: 0 auto;
  list-style: none;
  padding: 0;
`;

const RequirementItem = styled.li`
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  position: relative;
  padding-left: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  
  &:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #a77d3e;
    font-weight: bold;
  }
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(167, 125, 62, 0.2);
  padding-bottom: 1rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #a77d3e;
`;

const FAQAnswer = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const CTASection = styled.section`
  padding: 4rem 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/collector-quest-background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.1;
    z-index: 0;
  }
`;
