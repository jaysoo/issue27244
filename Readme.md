# Minimal reproduction for config sharing in the same workspace

## Solutions (from @jaysoo)

The problem is that `libs/vite-plugins/package.json` points to the `dist` folder, which is not generated during graph creation. There is a `global.NX_GRAPH_CREATION` variable that we can check to make sure we're either:

1. Not loading the plugin in `vite.config.ts` during graph creation; OR
2. Create separate `index.js` entry file that does not need to be built, which checks the global variable and return a stub during graph creation.


I've chosen (2) as I think it's cleaner, but I've also left comments in `vite.config.ts` to show (1).


```shell
yarn
nx build lib
```

It's not easy to have this work out of the box. We cannot guarantee support for workspace projects used in configuration files due to the exact problem outlined in this repo. That said, it is something we can explore in the future.


## Context

- Package based repo (aka using `workspaces`)
- 2 lib:
  - lib: a library we want to build, using vite
  - vite-plugins: a collection of custom vite plugins
- Uses Nx project inference with `@nx/vite/plugin`

## What is breaking

On the vite config of the library (packages/lib/vite.config.ts), we import the plugin we create in another package in our monorepo (in packages/vite-plugins), but this library has a build step because we want it in typescript (same case with a storybook shared config for example).

So we have the following going on:

- Nx daemon starts
- Nx graph compute starts
- Nx vite inference resolve the config, and import it (see https://github.com/nrwl/nx/blob/master/packages/vite/src/plugins/plugin.ts#L160 )
- But the reference to `@repro/vite-plugins` yields nothing because it wasn't built before, making the resolve of the config failing
- Making the graph a half broken state

And because the graph is partially failing, I can't build the vite-plugins anyway, because `yarn nx build vite-plugin` fails because of "Failed to process project graph"

## How to get it in a working state

- Comment out the plugin in the vite config
- Comment out the import in the vite config
- `yarn nx reset`
- `yarn nx build vite-plugins`
- Re add the plugin and the import
- `yarn nx reset`

And now it should works. But this dance is not possible on CI, only local environment, times the number of vite config files...

## Possible workaround

### Shared plugins as no build

If we remove the build step, then we don't have the issue anymore, but that means writing `.d.ts` files by hand and using `jsdoc` to type our code. While it works for simple cases, it doesn't for advanced cases like `@nx/storybook/plugin` where we want to do tsx with react code.

### Create a local custom Nx Inference for vite

We could write our own inference plugin for vite, but then given the internals of the target creators (see https://github.com/nrwl/nx/discussions/22099#discussioncomment-8801922 ), we can't reuse the settings from nx such as getting the updated metadata fields on the tasks, and that's a maintenance issue.

I would be ok doing the local Nx inference plugin if some of the internals were exposed (even if they don't have the same level of engagement in terms of stability as `@nx/devkit`).

The last resort I have is to patch the packages with yarn / pnpm to export it myself, but I would rather not do that if possible
