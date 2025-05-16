export const STORAGE_KEYS = {
  CURRENT_CHARACTER_ID: 'currentCharacterId',
  CHARACTERS: 'characters',
};

export const getCurrentCharacterId = () => localStorage.getItem(STORAGE_KEYS.CURRENT_CHARACTER_ID);

export const setCurrentCharacterId = (id: string) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_CHARACTER_ID, id);
};

export const getCharacters = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARACTERS) || '{}');
};

export const getCharacter = (id: string) => {
  const characters = getCharacters();
  return characters[id] || null;
};

export const setCharacter = (id: string, data: any) => {
  const characters = getCharacters();
  characters[id] = data;
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
};

export const removeCharacter = (id: string) => {
  const characters = getCharacters();
  delete characters[id];
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
};

export const clearCharacterData = (id: string) => {
  removeCharacter(id);
  const currentId = getCurrentCharacterId();
  if (currentId === id) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CHARACTER_ID);
  }
};

export const getCharacterKey = (id: string, key: string) => {
  const character = getCharacter(id);
  return character ? character[key] : null;
};

export const setCharacterKey = (id: string, key: string, value: any) => {
  const characters = getCharacters();
  if (!characters[id]) {
    characters[id] = {};
  }
  characters[id][key] = value;
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
};

export const removeCharacterKey = (id: string, key: string) => {
  const characters = getCharacters();
  if (characters[id]) {
    delete characters[id][key];
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  }
}; 