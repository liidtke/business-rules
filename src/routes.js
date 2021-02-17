import Home from './routes/Home.svelte';
import Rules from './routes/Rules.svelte';
import NotFound from './routes/NotFound.svelte';
import RuleHistory from './routes/RuleHistory.svelte';

export default {
    '/': Home,
    '/rules/:id?': Rules,
    '/history/:id':RuleHistory,
    // The catch-all route must always be last
    '*': NotFound
};
