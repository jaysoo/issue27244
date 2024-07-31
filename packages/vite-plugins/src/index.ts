import type { Plugin } from 'vite';

export function myDebugPlugin(): Plugin {
  return {
    name: 'local:my-plugin',
    config() {
      console.log('I AM BEING LOADED FROM THE LIBRARY!!!!!!!!!');
    },
  };
}
