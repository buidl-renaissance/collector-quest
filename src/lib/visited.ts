const VISITED_STORIES_KEY = 'visited_stories';

export const getVisitedStories = (): string[] => {
  if (typeof window === 'undefined') {
    console.log('getVisitedStories: window is undefined');
    return [];
  }
  
  try {
    const visited = localStorage.getItem(VISITED_STORIES_KEY);
    console.log('getVisitedStories: retrieved from localStorage:', visited);
    return visited ? JSON.parse(visited) : [];
  } catch (error) {
    console.error('Error reading visited stories from localStorage:', error);
    return [];
  }
};

export const markStoryAsVisited = (storyId: string): void => {
  if (typeof window === 'undefined') {
    console.log('markStoryAsVisited: window is undefined');
    return;
  }
  
  try {
    console.log('markStoryAsVisited: marking story as visited:', storyId);
    const visited = getVisitedStories();
    if (!visited.includes(storyId)) {
      visited.push(storyId);
      localStorage.setItem(VISITED_STORIES_KEY, JSON.stringify(visited));
      console.log('markStoryAsVisited: updated localStorage with:', visited);
    } else {
      console.log('markStoryAsVisited: story already visited:', storyId);
    }
  } catch (error) {
    console.error('Error marking story as visited:', error);
  }
};

export const isStoryVisited = (storyId: string): boolean => {
  if (typeof window === 'undefined') {
    console.log('isStoryVisited: window is undefined');
    return false;
  }
  
  try {
    const visited = getVisitedStories();
    const isVisited = visited.includes(storyId);
    console.log('isStoryVisited: checking story:', storyId, 'result:', isVisited);
    return isVisited;
  } catch (error) {
    console.error('Error checking if story is visited:', error);
    return false;
  }
};
