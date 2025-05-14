export const STORAGE_KEYS = {
  CURRENT_CHARACTER_ID: 'currentCharacterId',
  CHARACTER_IDS: 'characterIds',
};

export const getNamespacedKey = (characterId: string, key: string) => `character_${characterId}_${key}`;

export const getCurrentCharacterId = () => localStorage.getItem(STORAGE_KEYS.CURRENT_CHARACTER_ID);

export const setCurrentCharacterId = (id: string) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_CHARACTER_ID, id);
};

export const getCharacterIds = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARACTER_IDS) || '[]');
};

export const addCharacterId = (id: string) => {
  const ids = getCharacterIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(STORAGE_KEYS.CHARACTER_IDS, JSON.stringify(ids));
  }
};

export const removeCharacterId = (id: string) => {
  const ids = getCharacterIds();
  const newIds = ids.filter((existingId: string) => existingId !== id);
  localStorage.setItem(STORAGE_KEYS.CHARACTER_IDS, JSON.stringify(newIds));
};

export const getNamespacedItem = (characterId: string, key: string) => {
  return localStorage.getItem(getNamespacedKey(characterId, key));
};

export const setNamespacedItem = (characterId: string, key: string, value: string) => {
  localStorage.setItem(getNamespacedKey(characterId, key), value);
};

export const getNamespacedJson = (characterId: string, key: string) => {
  const value = getNamespacedItem(characterId, key);
  return value ? JSON.parse(value) : null;
};

export const setNamespacedJson = (characterId: string, key: string, value: any) => {
  setNamespacedItem(characterId, key, JSON.stringify(value));
};

export const removeNamespacedItem = (characterId: string, key: string) => {
  localStorage.removeItem(getNamespacedKey(characterId, key));
};

export const clearCharacterData = (characterId: string) => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(`character_${characterId}_`)) {
      localStorage.removeItem(key);
    }
  });
  removeCharacterId(characterId);
}; 