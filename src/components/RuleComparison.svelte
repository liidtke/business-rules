<script lang="ts">
    export let oldRule: any; //History
    export let currentRule: any; //IRule

    let fields: string[] = ["code", "title", "text", "status", "description"];

    console.log(oldRule, 'old');
    console.log(currentRule, 'current');
</script>

{#if oldRule && currentRule}
    {#each fields as field}
        <div class="label">{field}</div>
        <div class="field">
            {#if oldRule[field] === currentRule[field]}
                <div class="equal item">{currentRule[field] ?? ""}</div>
            {:else}
            <div class="diff">
                <div class="old item">{oldRule[field] ?? ""}</div>
                <div class="new item">{currentRule[field] ?? ""}</div>
            </div>
            {/if}
        </div>
    {/each}
{/if}

<style lang="scss">
    $green:#00c4a778;
    $red:#ff09095e;

    .field {
        display: flex;
    }

    .item{
        padding: 0.5rem;
        min-height: 40px;
        min-width: 70px;
        border: 1pt solid #0000001c;
        border-radius: 2px;
    }

    .equal {
        background-color: white;
        flex-grow: 1 100%;
    }

    .diff {
        display: inline-flex;
        .old {
            text-decoration: line-through;
            background-color: $red;
            
        }
        .new {
            background-color: $green;
        }
    }
</style>
