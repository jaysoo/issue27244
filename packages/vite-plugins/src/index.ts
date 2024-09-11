import type { Plugin } from 'vite';

export function myDebugPlugin(): Plugin {
  return {
    name: 'local:my-plugin',
    configResolved() {
      console.log('I AM BEING LOADED FROM THE LIBRARY!!!!!!!!!');
    },
  };
}
