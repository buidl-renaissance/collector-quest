import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaCrown, FaUserAlt, FaCheck } from 'react-icons/fa';

interface Character {
  name: string;
  archetype: string;
  traits: string[];
}

interface BuildCharacterProps {
  onCharacterCreated?: (character: Character) => void;
}

const BuildCharacter: React.FC<BuildCharacterProps> = ({ onCharacterCreated }) => {
  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState('');
  const [traits, setTraits] = useState<string[]>([]);
  const [customTrait, setCustomTrait] = useState('');
  const [step, setStep] = useState(1);

  const archetypes = [
    'Curious Explorer',
    'Skeptical Critic',
    'Aspiring Artist',
    'Mystical Seeker',
    'Eccentric Collector'
  ];

  const traitOptions = [
    'Witty', 'Observant', 'Imaginative', 'Analytical', 
    'Adventurous', 'Cautious', 'Charismatic', 'Mysterious',
    'Philosophical', 'Pragmatic', 'Whimsical', 'Determined'
  ];

  const handleTraitToggle = (trait: string) => {
    if (traits.includes(trait)) {
      setTraits(traits.filter(t => t !== trait));
    } else if (traits.length < 3) {
      setTraits([...traits, trait]);
    }
  };

  const handleAddCustomTrait = () => {
    if (customTrait && !traits.includes(customTrait) && traits.length < 3) {
      setTraits([...traits, customTrait]);
      setCustomTrait('');
    }
  };

  const handleSubmit = () => {
    if (name && archetype && traits.length > 0) {
      const character: Character = {
        name,
        archetype,
        traits
      };
      
      if (onCharacterCreated) {
        onCharacterCreated(character);
      }
    }
  };

  const nextStep = () => {
    if ((step === 1 && name) || 
        (step === 2 && archetype) || 
        (step === 3 && traits.length > 0)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <CharacterBuilderContainer>
      <CrownDivider>
        <FaCrown />
      </CrownDivider>
      
      <BuilderTitle>Create Your Character</BuilderTitle>
      <BuilderDescription>
        Who will you be in Lord Smearington&apos;s Gallery of the Absurd?
      </BuilderDescription>
      
      <StepIndicator>
        <StepDot active={step >= 1} completed={step > 1}>
          {step > 1 ? <FaCheck /> : 1}
        </StepDot>
        <StepLine completed={step > 1} />
        <StepDot active={step >= 2} completed={step > 2}>
          {step > 2 ? <FaCheck /> : 2}
        </StepDot>
        <StepLine completed={step > 2} />
        <StepDot active={step >= 3} completed={step > 3}>
          {step > 3 ? <FaCheck /> : 3}
        </StepDot>
      </StepIndicator>
      
      {step === 1 && (
        <StepContainer>
          <StepTitle>What is your name?</StepTitle>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your character's name"
          />
        </StepContainer>
      )}
      
      {step === 2 && (
        <StepContainer>
          <StepTitle>Choose your archetype</StepTitle>
          <ArchetypeGrid>
            {archetypes.map((arch) => (
              <ArchetypeCard 
                key={arch} 
                selected={archetype === arch}
                onClick={() => setArchetype(arch)}
              >
                <FaUserAlt />
                <ArchetypeName>{arch}</ArchetypeName>
              </ArchetypeCard>
            ))}
          </ArchetypeGrid>
        </StepContainer>
      )}
      
      {step === 3 && (
        <StepContainer>
          <StepTitle>Select up to 3 character traits</StepTitle>
          <TraitsContainer>
            <TraitsList>
              {traitOptions.map((trait) => (
                <TraitButton 
                  key={trait} 
                  selected={traits.includes(trait)}
                  disabled={traits.length >= 3 && !traits.includes(trait)}
                  onClick={() => handleTraitToggle(trait)}
                >
                  {trait}
                </TraitButton>
              ))}
            </TraitsList>
            
            <CustomTraitContainer>
              <Input
                type="text"
                value={customTrait}
                onChange={(e) => setCustomTrait(e.target.value)}
                placeholder="Add a custom trait"
                disabled={traits.length >= 3}
              />
              <AddTraitButton 
                onClick={handleAddCustomTrait}
                disabled={!customTrait || traits.length >= 3}
              >
                Add
              </AddTraitButton>
            </CustomTraitContainer>
            
            <SelectedTraits>
              <SelectedTraitsLabel>Selected traits:</SelectedTraitsLabel>
              {traits.length > 0 ? (
                traits.map((trait) => (
                  <SelectedTrait key={trait}>
                    {trait}
                    <RemoveTraitButton onClick={() => handleTraitToggle(trait)}>
                      ×
                    </RemoveTraitButton>
                  </SelectedTrait>
                ))
              ) : (
                <EmptyTraits>No traits selected</EmptyTraits>
              )}
            </SelectedTraits>
          </TraitsContainer>
        </StepContainer>
      )}
      
      {step === 4 && (
        <StepContainer>
          <StepTitle>Character Summary</StepTitle>
          <CharacterSummary>
            <SummaryItem>
              <SummaryLabel>Name:</SummaryLabel>
              <SummaryValue>{name}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Archetype:</SummaryLabel>
              <SummaryValue>{archetype}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Traits:</SummaryLabel>
              <SummaryValue>{traits.join(', ')}</SummaryValue>
            </SummaryItem>
          </CharacterSummary>
        </StepContainer>
      )}
      
      <NavigationButtons>
        {step > 1 && (
          <NavButton onClick={prevStep}>
            Back
          </NavButton>
        )}
        
        {step < 4 ? (
          <NavButton 
            primary 
            onClick={nextStep}
            disabled={(step === 1 && !name) || 
                     (step === 2 && !archetype) || 
                     (step === 3 && traits.length === 0)}
          >
            Next
          </NavButton>
        ) : (
          <NavButton primary onClick={handleSubmit}>
            Complete Character
          </NavButton>
        )}
      </NavigationButtons>
    </CharacterBuilderContainer>
  );
};

// Animations
const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const CharacterBuilderContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  border: 2px solid #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  
  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const CrownDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  position: relative;
  
  &:before, &:after {
    content: "";
    height: 1px;
    background: linear-gradient(90deg, transparent, #FFD700, transparent);
    flex: 1;
  }
  
  svg {
    color: #FFD700;
    font-size: 1.5rem;
    margin: 0 1rem;
  }
`;

const BuilderTitle = styled.h2`
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #FFD700;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const BuilderDescription = styled.p`
  text-align: center;
  color: #C7BFD4;
  margin-bottom: 2rem;
  font-size: 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

interface StepDotProps {
  active: boolean;
  completed: boolean;
}

const StepDot = styled.div<StepDotProps>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? '#FFD700' : 'transparent'};
  color: ${props => props.active ? '#3B4C99' : '#C7BFD4'};
  border: 2px solid ${props => props.active ? '#FFD700' : '#C7BFD4'};
  font-weight: bold;
  transition: all 0.3s ease;
  
  ${props => props.completed && `
    background: #FFD700;
    color: #3B4C99;
  `}
`;

interface StepLineProps {
  completed: boolean;
}

const StepLine = styled.div<StepLineProps>`
  height: 2px;
  width: 50px;
  background: ${props => props.completed ? '#FFD700' : '#C7BFD4'};
  transition: all 0.3s ease;
`;

const StepContainer = styled.div`
  margin-bottom: 2rem;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #F4C4F3;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #FFD700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  
  &::placeholder {
    color: rgba(199, 191, 212, 0.6);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ArchetypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

interface ArchetypeCardProps {
  selected: boolean;
}

const ArchetypeCard = styled.div<ArchetypeCardProps>`
  padding: 1.5rem 1rem;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? '#FFD700' : 'rgba(255, 215, 0, 0.3)'};
  background: ${props => props.selected ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.3)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    font-size: 1.5rem;
    color: ${props => props.selected ? '#FFD700' : '#C7BFD4'};
    margin-bottom: 0.5rem;
  }
  
  &:hover {
    border-color: #FFD700;
    background: rgba(255, 215, 0, 0.05);
  }
  
  ${props => props.selected && `
    animation: ${pulse} 2s infinite ease-in-out;
  `}
`;

const ArchetypeName = styled.span`
  color: #C7BFD4;
  text-align: center;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const TraitsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TraitsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

interface TraitButtonProps {
  selected: boolean;
  disabled: boolean;
}

const TraitButton = styled.button<TraitButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 2px solid ${props => props.selected ? '#FFD700' : 'rgba(255, 215, 0, 0.3)'};
  background: ${props => props.selected ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  color: ${props => props.selected ? '#FFD700' : '#C7BFD4'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover:not(:disabled) {
    border-color: #FFD700;
    background: rgba(255, 215, 0, 0.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CustomTraitContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AddTraitButton = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(255, 215, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectedTraits = styled.div`
  padding: 1rem;
  border-radius: 8px;
  border: 1px dashed rgba(255, 215, 0, 0.3);
  background: rgba(0, 0, 0, 0.2);
`;

const SelectedTraitsLabel = styled.div`
  color: #F4C4F3;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const SelectedTrait = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid #FFD700;
  color: #FFD700;
  font-size: 0.9rem;
`;

const RemoveTraitButton = styled.button`
  background: none;
  border: none;
  color: #FFD700;
  margin-left: 0.3rem;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 0.5;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyTraits = styled.div`
  color: rgba(199, 191, 212, 0.6);
  font-style: italic;
  font-size: 0.9rem;
`;

const CharacterSummary = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const SummaryItem = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  color: #F4C4F3;
  font-weight: 500;
  margin-right: 0.5rem;
  min-width: 100px;
`;

const SummaryValue = styled.span`
  color: #C7BFD4;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

interface NavButtonProps {
  primary?: boolean;
  disabled?: boolean;
}

const NavButton = styled.button<NavButtonProps>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #3B4C99, #5A3E85)"
      : "transparent"};
  color: ${(props) => (props.primary ? "#fff" : "#FFD700")};
  border: 2px solid #FFD700;
  text-decoration: none;
  text-align: center;
  font-family: "Cormorant Garamond", serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (min-width: 480px) {
    font-size: 1rem;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    background: ${(props) =>
      props.primary ? "#5A3E85" : "rgba(255, 215, 0, 0.1)"};
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default BuildCharacter;
