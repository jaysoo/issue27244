import type { Plugin } from 'vite';

export function myDebugPlugin(): Plugin {
  return {
    name: 'local:my-plugin',
    configResolved(config) {
      console.log('Resolved config');
      console.dir(config);
    },
  };
}
