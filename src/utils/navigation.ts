import { NextRouter } from 'next/router';

export const navigateTo = (router: NextRouter, path: string) => {
  window.scrollTo(0, 0);
  router.push(path);
}; 