<script lang="ts">
    import { onMount } from "svelte";
    import Quill from "Quill";

    export let text: any; //html
    let quill;
    let editor;

    $: {
        if (quill && text != quill.root.innerHTML) {
            if(!text){
                text = "";
            }
            quill.root.innerHTML = text;
        }
    }

    function getText() {
       
        let contents = quill.getContents();
        let text = JSON.stringify(contents);
        console.log(quill.root.innerHTML);
    }

    export let toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ list: "bullet" }, { list: "ordered" }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ align: [] }],
        ["clean"],
    ];

    onMount(async () => {
        quill = new Quill(editor, {
            modules: {
                toolbar: toolbarOptions,
            },
            theme: "snow",
            placeholder: "Texto..",
        });

        if (text) {
            quill.root.innerHTML = text;
        }

        quill.on("text-change", function (delta, oldDelta, source) {
            if (source == "user") {
                text = quill.root.innerHTML;
            }
        });
    });
</script>

<div class="editor-wrapper">
    <div bind:this={editor} />
</div>

<!-- <button on:click={getText}>Logme</button> -->

<style>
</style>
