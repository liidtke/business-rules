
# Required for login
.\caddy_windows_amd64.exe reverse-proxy --from 127.0.0.1:3000 --to localhost:5000

# Svelte app with svelte-spa-router

This is a project template for [Svelte](https://svelte.dev) apps that includes [svelte-spa-router](https://github.com/italypaleale/svelte-spa-router) for client-side routing, and Rollup as bundler.


```bash
npx degit italypaleale/svelte-spa-router-template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## About svelte-spa-router

svelte-spa-router is a client-side router for Svelte 3 apps that leverages hash-based routing (i.e. stores the current view in the URL after the `#` symbol).

You can read more about the router, and the reasons why you might want to use hash-based routing (or not), in the [documentation](https://github.com/italypaleale/svelte-spa-router).

## Get started

Install the dependencies…

```bash
cd svelte-app
npm install
```

…then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```


## Building and running in production mode

To create an optimized version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv) too.

## Using TypeScript

This template comes with a script to set up a TypeScript development environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

Or remove the script via:

```bash
rm scripts/setupTypeScript.js
```
