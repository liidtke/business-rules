<script lang="ts">
    import { replace, push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import RuleComparison from "../components/RuleComparison.svelte";
    import service from "../service";
    import dateConverter from "../date-converter";

    export let params = {};

    let rule: any;
    let history: any[];

    let oldRule;
    let selectedRule;
    let selectedHistory;
    let loading: boolean;

    onMount(async () => {
        await service.init();
        if (params.id) {
            loading = true;
            history = await service.getRuleHistory(params.id);
            rule = await service.getRule(params.id);
            loading = false;
            
        }
    });

    function selectHistory(hist) {
        selectedHistory = hist;
        oldRule = null;
        selectedRule = null;
        
        //select previous history
        let index = history.indexOf(hist);
        
        if(history.length == 1 || index + 1 == history.length){
            oldRule = hist.rule;
            selectedRule = rule; //current rule
        }
        else {
            oldRule = hist.rule;
            selectedRule = history[index + 1].rule;
        }
    }
</script>

<div class="v-section">
    <h1 class="is-size-2">Histórico da Regras</h1>
    {#if history && rule}
        {#if rule}
            <h3 class="subtitle">Regra {rule.code}</h3>
        {/if}
        <div class="columns is-variable is-6">
            <div class="column">
                <div class="brules-menu box">
                    {#each history as hist}
                        <a class="item" on:click={selectHistory(hist)}>
                            Por {hist.createdBy} em {dateConverter.convert(
                                hist.creationDate
                            )}
                        </a>
                    {:else}
                        <p>Essa regra não possui histórico</p>
                    {/each}
                </div>
            </div>
            <div class="column is-two-thirds">
                {#if selectedRule && oldRule}
                    <h3 class="title">Modificações</h3>
                    <h3 class="subtitle">Alterado por {selectedHistory.createdBy} em {dateConverter.convert(
                        selectedHistory.creationDate
                    )}</h3>
                    <RuleComparison
                        bind:oldRule={oldRule}
                        bind:currentRule={selectedRule}
                    />
                {/if}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .brules-menu {
        font-size: 1rem;
        display: block;
        line-height: 1.25;

        a.action,
        a.item {
            display: block;
            padding: 0.5em 0.75em;
            border-radius: 2px;
            cursor: pointer;
            text-decoration: none;
            color: rgb(74, 74, 74) !important;

            &:hover {
                background-color: #f5f5f5;
                color: #363636;
            }
            &.is-active {
                background-color: #3273dc;
                color: #ffff !important;
            }
            &.stronger {
                font-weight: 600;
            }
        }
    }
</style>
