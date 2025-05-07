import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FaArrowLeft, FaArrowRight, FaCopy, FaRandom, FaMoon, FaSun } from 'react-icons/fa';
import PageTransition from '@/components/PageTransition';
import { GetServerSidePropsContext } from 'next';
import { getRaceById } from '@/db/races';
import { getClassById } from '@/db/classes';
import { CharacterClass, getCharacterClassById } from '@/data/classes';
import { Race } from '@/data/races';


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { race, class: selectedClass } = context.query;

  const dbRace = await getRaceById(race as string);
  const dbClass = await getClassById(selectedClass as string);
  if (!dbClass) {
    return {
      props: {
        race: dbRace,
        class: getCharacterClassById(selectedClass as string)
      }
    };
  }
  
  return {
    props: { race: dbRace, class: dbClass },
  };
};

const CharacterBioPage: React.FC<{ race: Race, class: CharacterClass }> = ({ race, class: selectedClass }) => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [characterBio, setCharacterBio] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    race: race.name,
    class: selectedClass.name,
    personality: '',
    motivation: '',
    fear: '',
    hauntingMemory: '',
    treasuredPossession: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomize = () => {
    // This would be expanded with actual random options
    setFormData({
      name: ['Thorne Blackwood', 'Lyra Stormwhisper', 'Galen Fireheart'][Math.floor(Math.random() * 3)],
      race: race.name,
      class: selectedClass.name,
      personality: ['Brooding', 'Cheerful', 'Suspicious', 'Bold'][Math.floor(Math.random() * 4)],
      motivation: ['Revenge', 'Knowledge', 'Wealth', 'Glory'][Math.floor(Math.random() * 4)],
      fear: ['Darkness', 'Failure', 'Betrayal', 'Loss'][Math.floor(Math.random() * 4)],
      hauntingMemory: ['A village burning', 'A lost love', 'A broken promise', 'A mysterious stranger'][Math.floor(Math.random() * 4)],
      treasuredPossession: ['A family heirloom', 'A mysterious map', 'A mentor\'s gift', 'A token of victory'][Math.floor(Math.random() * 4)]
    });
  };

  const handleBack = () => {
    router.push('/character/class');
  };

  const generateBio = () => {
    setIsLoading(true);
    
    // Simulate API call or processing time
    setTimeout(() => {
      const firstPersonBio = `I am ${formData.name}, a ${formData.personality} ${formData.race} ${formData.class}. My quest for ${formData.motivation} drives me forward, though I am haunted by ${formData.hauntingMemory}. Above all, I fear ${formData.fear}, yet I find comfort in my most treasured possession: ${formData.treasuredPossession}.`;
      
      const thirdPersonBio = `${formData.name} is a ${formData.personality} ${formData.race} ${formData.class}. Driven by a desire for ${formData.motivation}, they push forward despite being haunted by ${formData.hauntingMemory}. Though they deeply fear ${formData.fear}, they find solace in their most treasured possession: ${formData.treasuredPossession}.`;
      
      setCharacterBio(isFirstPerson ? firstPersonBio : thirdPersonBio);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(characterBio);
    // Could add a toast notification here
  };

  return (
    <PageTransition>
      <Container darkMode={darkMode}>
        <Header>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back
          </BackButton>
          <ThemeToggle onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
        </Header>

        <HeroSection>
          <Title>Forge Your Legend in Seconds</Title>
          <Subtitle>Answer a few questions. Get a rich character backstory.</Subtitle>
        </HeroSection>

        <RandomizeButton onClick={handleRandomize}>
          <FaRandom /> Randomize All
        </RandomizeButton>

        <StepTitle>Create Your Character</StepTitle>

        <FormSection>
          <FormGroup>
            <Label htmlFor="name">Character Name</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Enter your character's name"
            />
          </FormGroup>
          <FormRow>
            <FormGroup>
              <Label htmlFor="race">Race</Label>
              <Input 
                type="text" 
                id="race" 
                name="race" 
                value={formData.race} 
                readOnly 
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="class">Class</Label>
              <Input 
                type="text" 
                id="class" 
                name="class" 
                value={formData.class} 
                readOnly 
              />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label htmlFor="personality">Personality Trait</Label>
            <Select id="personality" name="personality" value={formData.personality} onChange={handleInputChange}>
              <option value="">Select a personality trait</option>
              <option value="Brooding">Brooding</option>
              <option value="Cheerful">Cheerful</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Bold">Bold</option>
              <option value="Cautious">Cautious</option>
              <option value="Eccentric">Eccentric</option>
              <option value="Honorable">Honorable</option>
              <option value="Mischievous">Mischievous</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="motivation">Primary Motivation</Label>
            <Select id="motivation" name="motivation" value={formData.motivation} onChange={handleInputChange}>
              <option value="">Select a motivation</option>
              <option value="Revenge">Revenge</option>
              <option value="Knowledge">Knowledge</option>
              <option value="Wealth">Wealth</option>
              <option value="Glory">Glory</option>
              <option value="Power">Power</option>
              <option value="Justice">Justice</option>
              <option value="Freedom">Freedom</option>
              <option value="Love">Love</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="fear">Greatest Fear</Label>
            <Select id="fear" name="fear" value={formData.fear} onChange={handleInputChange}>
              <option value="">Select a fear</option>
              <option value="Darkness">Darkness</option>
              <option value="Failure">Failure</option>
              <option value="Betrayal">Betrayal</option>
              <option value="Loss">Loss</option>
              <option value="Confinement">Confinement</option>
              <option value="The Unknown">The Unknown</option>
              <option value="Death">Death</option>
              <option value="Being Forgotten">Being Forgotten</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="hauntingMemory">A Memory That Haunts You</Label>
            <TextArea 
              id="hauntingMemory" 
              name="hauntingMemory" 
              value={formData.hauntingMemory} 
              onChange={handleInputChange} 
              placeholder="Describe a memory that haunts your character..."
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="treasuredPossession">Most Treasured Possession</Label>
            <TextArea 
              id="treasuredPossession" 
              name="treasuredPossession" 
              value={formData.treasuredPossession} 
              onChange={handleInputChange} 
              placeholder="Describe your character's most treasured possession..."
            />
          </FormGroup>
        </FormSection>

        {!characterBio ? (
          <NavigationFooter>
            <NextButton 
              onClick={generateBio}
              disabled={
                !formData.name || !formData.race || !formData.class || 
                !formData.personality || !formData.motivation || !formData.fear || 
                !formData.hauntingMemory || !formData.treasuredPossession
              }
            >
              Generate Bio <FaArrowRight />
            </NextButton>
          </NavigationFooter>
        ) : (
          <ResultSection>
            {isLoading ? (
              <LoadingContainer>
                <ScrollAnimation />
                <LoadingText>Crafting your legend...</LoadingText>
              </LoadingContainer>
            ) : (
              <>
                <BioScroll>
                  <BioContent>{characterBio}</BioContent>
                </BioScroll>
                <ActionButtons>
                  <ActionButton onClick={copyToClipboard}>
                    <FaCopy /> Copy
                  </ActionButton>
                  <ActionButton onClick={() => setCharacterBio('')}>
                    Create Another
                  </ActionButton>
                  <ViewToggle>
                    <ToggleLabel>
                      <input 
                        type="checkbox" 
                        checked={isFirstPerson} 
                        onChange={() => {
                          setIsFirstPerson(!isFirstPerson);
                          if (characterBio) generateBio();
                        }} 
                      />
                      {isFirstPerson ? "First Person" : "Third Person"}
                    </ToggleLabel>
                  </ViewToggle>
                </ActionButtons>
              </>
            )}
          </ResultSection>
        )}
      </Container>
    </PageTransition>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const unfurl = keyframes`
  from { height: 0; opacity: 0; }
  to { height: 200px; opacity: 1; }
`;

// Styled Components
const Container = styled.div<{ darkMode: boolean }>`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Cormorant Garamond', serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 80px;
  color: ${props => props.darkMode ? '#E0DDE5' : '#333'};
  background-color: ${props => props.darkMode ? '#1a1a2e' : '#f5f5f7'};
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #bb8930;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;
  
  &:hover {
    color: #d4a959;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: #bb8930;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: #d4a959;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #bb8930;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #C7BFD4;
  margin-bottom: 2rem;
`;

const RandomizeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto 2rem;
  padding: 0.6rem 1.2rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
  }
`;

const StepTitle = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  color: #bb8930;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-in;
`;

const FormSection = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #C7BFD4;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  color: inherit;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  
  &:focus {
    border-color: #bb8930;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  color: inherit;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  
  &:focus {
    border-color: #bb8930;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(58, 51, 71, 0.3);
  border: 1px solid #3a3347;
  border-radius: 4px;
  color: inherit;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: #bb8930;
    outline: none;
  }
`;

const NavigationFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #bb8930;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  font-family: 'Cormorant Garamond', serif;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #d4a959;
  }
  
  &:disabled {
    background-color: #3a3347;
    cursor: not-allowed;
  }
`;

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-in;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const ScrollAnimation = styled.div`
  width: 60px;
  height: 80px;
  background-color: #bb8930;
  border-radius: 8px;
  position: relative;
  margin-bottom: 1rem;
  animation: ${float} 2s infinite ease-in-out;
  
  &:before, &:after {
    content: '';
    position: absolute;
    background-color: rgba(187, 137, 48, 0.3);
    border-radius: 4px;
  }
  
  &:before {
    width: 40px;
    height: 6px;
    top: 20px;
    left: 10px;
  }
  
  &:after {
    width: 40px;
    height: 6px;
    top: 34px;
    left: 10px;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #bb8930;
`;

const BioScroll = styled.div`
  background-color: rgba(58, 51, 71, 0.2);
  border: 1px solid #bb8930;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
  animation: ${unfurl} 1s ease-out;
`;

const BioContent = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #C7BFD4;
  
  input {
    margin: 0;
  }
`;

const InspirationGallery = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #3a3347;
`;

const GalleryTitle = styled.h3`
  font-size: 1.5rem;
  color: #bb8930;
  margin-bottom: 1rem;
  text-align: center;
`;

const ExampleBios = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ExampleBio = styled.div`
  background-color: rgba(58, 51, 71, 0.2);
  border: 1px solid #3a3347;
  border-radius: 8px;
  padding: 1.5rem;
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export default CharacterBioPage;
