
const VISITED_STORIES_KEY = 'visited_stories';

export const getVisitedStories = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  const visited = localStorage.getItem(VISITED_STORIES_KEY);
  return visited ? JSON.parse(visited) : [];
};

export const markStoryAsVisited = (storyId: string): void => {
  if (typeof window === 'undefined') return;
  
  const visited = getVisitedStories();
  if (!visited.includes(storyId)) {
    visited.push(storyId);
    localStorage.setItem(VISITED_STORIES_KEY, JSON.stringify(visited));
  }
};

export const isStoryVisited = (storyId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const visited = getVisitedStories();
  return visited.includes(storyId);
};
