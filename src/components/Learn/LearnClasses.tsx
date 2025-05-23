import React from 'react';
import styled from '@emotion/styled';
import { 
  FaShieldAlt, 
  FaGraduationCap, 
  FaMapMarkedAlt, 
  FaGem 
} from 'react-icons/fa';

const LearnClasses: React.FC = () => {
  return (
    <Container>
      <Title>Understanding Character Classes</Title>

      <Section>
        <SectionTitle>
          <IconWrapper>
            <FaShieldAlt />
          </IconWrapper>
          Core Abilities & Stats
        </SectionTitle>
        <Text>
          Each class starts with unique base stats and special abilities
          that influence how they perform in combat and interactions:
        </Text>
        <List>
          <ListItem>
            <strong>Warriors:</strong> High strength and defense; excel
            in close combat.
          </ListItem>
          <ListItem>
            <strong>Mages:</strong> High intelligence and mana; use
            powerful spells but have lower health.
          </ListItem>
          <ListItem>
            <strong>Rogues:</strong> High agility and stealth;
            specialize in critical strikes and sneaky maneuvers.
          </ListItem>
          <ListItem>
            <strong>Clerics:</strong> Focus on healing and support
            magic; improve team survivability.
          </ListItem>
        </List>
        <Text>
          These differences affect how you engage in quests and battles,
          your combat style (melee, ranged, magic, support), and what
          types of equipment or artifacts are usable.
        </Text>
      </Section>

      <Section>
        <SectionTitle>
          <IconWrapper>
            <FaGraduationCap />
          </IconWrapper>
          Skills & Progression
        </SectionTitle>
        <Text>
          As you complete quests or gain experience:
        </Text>
        <List>
          <ListItem>
            Each class unlocks unique skills or passive bonuses.
          </ListItem>
          <ListItem>
            You may specialize further into subclasses or gain new
            synergies with artifacts and relics.
          </ListItem>
        </List>
        <Text>
          <strong>Example:</strong>
        </Text>
        <List>
          <ListItem>
            A Mage may evolve into an Elementalist or Illusionist, each
            with distinct spell paths.
          </ListItem>
          <ListItem>
            A Rogue might choose between an Assassin (stealth burst) or
            Trickster (trap and misdirection).
          </ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>
          <IconWrapper>
            <FaMapMarkedAlt />
          </IconWrapper>
          Quest Options & Outcomes
        </SectionTitle>
        <Text>
          Certain quests may have class-specific branches or bonuses,
          such as:
        </Text>
        <List>
          <ListItem>
            A locked door that only a Rogue can pick.
          </ListItem>
          <ListItem>
            A puzzle solvable only by a Mage&apos;s spell.
          </ListItem>
          <ListItem>
            Moral dilemmas where a Cleric&apos;s alignment influences
            the result.
          </ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>
          <IconWrapper>
            <FaGem />
          </IconWrapper>
          Artifact Compatibility
        </SectionTitle>
        <Text>
          Classes may interact differently with artifacts:
        </Text>
        <List>
          <ListItem>
            Some artifacts or relics may require a specific class to
            activate their full power.
          </ListItem>
          <ListItem>
            Passive bonuses may scale with class stats (e.g., a Warrior
            gains more from strength-based relics).
          </ListItem>
        </List>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  background-color: #1a1a2e;
  border: 2px solid #bb8930;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #bb8930;
  margin: 0 0 1.5rem;
  font-size: 1.8rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #bb8930;
  display: flex;
  align-items: center;
  margin: 0 0 1rem;
  font-size: 1.3rem;
`;

const IconWrapper = styled.span`
  color: #bb8930;
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
`;

const Text = styled.p`
  color: #e6e6e6;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  padding-left: 1.5rem;
  margin: 0.5rem 0 1rem;
`;

const ListItem = styled.li`
  color: #e6e6e6;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  list-style-type: disc;
`;

export default LearnClasses;