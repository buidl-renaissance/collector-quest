import React, { useState } from "react";
import styled from "@emotion/styled";
import { FaUserAlt, FaDice } from "react-icons/fa";

interface CraftChampionProps {
  onCharacterCreated?: (character: Character) => void;
}

interface Character {
  race: string;
  class: string;
  backstory: string;
}

const CraftChampion: React.FC<CraftChampionProps> = ({ onCharacterCreated }) => {
  const [character, setCharacter] = useState<Character>({
    race: "",
    class: "",
    backstory: "",
  });

  const races = ["Human", "Elf", "Dwarf", "Goblin", "Lizardfolk", "Orc", "Halfling"];
  const classes = ["Fighter", "Bard", "Warlock", "Wizard", "Rogue", "Cleric", "Ranger"];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };

  const generateRandomBackstory = () => {
    const backstories = [
      "Once exiled, now called by prophecy...",
      "A forgotten heir to a fallen kingdom...",
      "Cursed by a witch, seeking redemption...",
      "The last survivor of a destroyed village...",
      "A former guild thief with a mysterious patron...",
    ];
    const randomBackstory = backstories[Math.floor(Math.random() * backstories.length)];
    setCharacter(prev => ({ ...prev, backstory: randomBackstory }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (character.race && character.class && character.backstory && onCharacterCreated) {
      onCharacterCreated(character);
    }
  };

  return (
    <ChampionContainer>
      <SectionTitle>
        <SectionIcon>
          <FaUserAlt />
        </SectionIcon>
        Craft Your Champion
      </SectionTitle>
      <Description>Every legend begins with a choice.</Description>
      
      <ChampionForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="race">Choose your Race</Label>
          <Select 
            id="race" 
            name="race" 
            value={character.race} 
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a race...</option>
            {races.map(race => (
              <option key={race} value={race}>{race}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="class">Choose your Class</Label>
          <Select 
            id="class" 
            name="class" 
            value={character.class} 
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a class...</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="backstory">Your Backstory</Label>
          <BackstoryContainer>
            <Textarea 
              id="backstory" 
              name="backstory" 
              value={character.backstory} 
              onChange={handleChange}
              placeholder="Write your character's backstory..."
              required
            />
            <RandomButton type="button" onClick={generateRandomBackstory}>
              <FaDice /> Let Fate Decide
            </RandomButton>
          </BackstoryContainer>
        </FormGroup>
        
        <SubmitButton type="submit" disabled={!character.race || !character.class || !character.backstory}>
          Begin Your Journey
        </SubmitButton>
      </ChampionForm>
      
      <Quote>&quot;{character.backstory || "Once exiled, now called by prophecy… Your journey begins."}&quot;</Quote>
    </ChampionContainer>
  );
};

const ChampionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #bb8930;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-family: "Cinzel Decorative", "Playfair Display SC", serif;
`;

const SectionIcon = styled.span`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bb8930;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #d4d4d4;
`;

const ChampionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #bb8930;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #bb8930;
  background-color: rgba(0, 0, 0, 0.7);
  color: #d4d4d4;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #d4a44c;
  }
`;

const BackstoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #bb8930;
  background-color: rgba(0, 0, 0, 0.7);
  color: #d4d4d4;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #d4a44c;
  }
`;

const RandomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba(187, 137, 48, 0.2);
  color: #bb8930;
  border: 1px solid #bb8930;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.3);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: linear-gradient(90deg, #bb8930, #b6551c, #bb8930);
  background-size: 200% auto;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background-position: right center;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quote = styled.blockquote`
  font-style: italic;
  color: #bb8930;
  text-align: center;
  margin-top: 2rem;
`;

export default CraftChampion;
