import { useState, useEffect } from 'react';
import { Character, CharacterStatus } from '@/data/character';
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';
import { useCurrentCharacter } from './useCurrentCharacter';

interface BuilderState {
  step: number;
  isComplete: boolean;
  currentSection: string;
  validations: {[key: string]: boolean};
}

export function useCharacterBuilder() {
  const { character, updateCharacter } = useCurrentCharacter();
  const [builderState, setBuilderState] = useState<BuilderState>({
    step: 1,
    isComplete: false,
    currentSection: 'sex',
    validations: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuilderState = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          setLoading(false);
          return;
        }

        const savedState = getCharacterKey(characterId, 'builderState');
        if (savedState) {
          setBuilderState(savedState);
        }
      } catch (error) {
        console.error('Error loading builder state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBuilderState();
  }, []);

  const updateBuilderState = (updates: Partial<BuilderState>) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    const newState = { ...builderState, ...updates };
    setBuilderState(newState);
    setCharacterKey(characterId, 'builderState', newState);
  };

  const validateSection = (section: string): boolean => {
    if (!character) return false;

    const validations: {[key: string]: (char: Character) => boolean} = {
      sex: (char) => !!char.sex,
      race: (char) => !!char.race,
      class: (char) => !!char.class,
      background: (char) => !!(char.traits?.background),
      alignment: (char) => !!(char.traits?.alignment),
      deity: (char) => {
        // Deity is required for Clerics and Paladins
        if (char.class?.name === 'Cleric' || char.class?.name === 'Paladin') {
          return !!(char.traits?.deity);
        }
        // Optional for others
        return true;
      },
      image: (char) => !!char.image_url,
      traits: (char) => {
        return !!(char.traits?.personality?.length &&
                 char.traits?.personality?.length >= 3 &&
                 char.traits?.ideals?.length &&
                 char.traits?.ideals?.length >= 3 &&
                 char.traits?.bonds?.length &&
                 char.traits?.bonds?.length >= 3 &&
                 char.traits?.flaws?.length &&
                 char.traits?.flaws?.length >= 3);
      },
      motivation: (char) => !!(char.traits?.actions?.length &&
                 char.traits?.actions?.length >= 1 &&
                 char.traits?.forces?.length &&
                 char.traits?.forces?.length >= 1),
      story: (char) => !!(char.traits?.background),
      equipment: (char) => !!(char.equipment && Object.keys(char.equipment).length > 0),
      sheet: (char) => !!(char.status === CharacterStatus.COMPLETED)
    };

    const isValid = validations[section]?.(character) ?? false;
    updateBuilderState({
      validations: { ...builderState.validations, [section]: isValid }
    });
    return isValid;
  };

  const nextStep = () => {
    if (validateSection(builderState.currentSection)) {
      const sections = [
        'sex', 'race', 'class', 'background', 'alignment', 'deity', 'image',
        'traits', 'motivation', 'story', 'equipment', 'sheet'
      ];
      const currentIndex = sections.indexOf(builderState.currentSection);
      
      if (currentIndex < sections.length - 1) {
        // Skip deity section if not Cleric/Paladin and no deity selected
        if (sections[currentIndex + 1] === 'deity' && 
            character?.class?.name !== 'Cleric' && 
            character?.class?.name !== 'Paladin' && 
            !character?.traits?.deity) {
          updateBuilderState({
            step: builderState.step + 2,
            currentSection: sections[currentIndex + 2]
          });
        } else {
          updateBuilderState({
            step: builderState.step + 1,
            currentSection: sections[currentIndex + 1]
          });
        }
      } else {
        updateBuilderState({
          isComplete: true
        });
      }
    }
  };

  const previousStep = () => {
    const sections = [
      'sex', 'race', 'class', 'background', 'alignment', 'deity', 'image',
      'traits', 'motivation', 'story', 'equipment', 'sheet'
    ];
    const currentIndex = sections.indexOf(builderState.currentSection);
    
    if (currentIndex > 0) {
      // Skip deity section backwards if not Cleric/Paladin and no deity selected
      if (sections[currentIndex - 1] === 'deity' &&
          character?.class?.name !== 'Cleric' && 
          character?.class?.name !== 'Paladin' && 
          !character?.traits?.deity) {
        updateBuilderState({
          step: builderState.step - 2,
          currentSection: sections[currentIndex - 2]
        });
      } else {
        updateBuilderState({
          step: builderState.step - 1,
          currentSection: sections[currentIndex - 1]
        });
      }
    }
  };

  return {
    builderState,
    loading,
    nextStep,
    previousStep,
    validateSection,
    updateBuilderState
  };
}
