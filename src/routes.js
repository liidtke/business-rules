import Home from './routes/Home.svelte';
import Rules from './routes/Rules.svelte';
import NotFound from './routes/NotFound.svelte';

export default {
    '/': Home,
    '/rules/:id?': Rules,
    // The catch-all route must always be last
    '*': NotFound
};
