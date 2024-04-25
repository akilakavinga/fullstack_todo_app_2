<script lang="ts">
  import { navigating } from "$app/stores";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import { fade } from "svelte/transition";

  const progress = tweened(0, {
    duration: 300,
    easing: cubicOut,
  });

  $: {
    if ($navigating) {
      progress.set(0, { duration: 0 });
      progress.set(70, { duration: 3000 });
    } else {
      progress.set(100, { duration: 500 });
    }
  }
</script>

<div class="loader_container">
  {#if $progress < 100}
    <div out:fade class="page_loading_bar" style="width: {$progress}%;" />
  {/if}
</div>

<style>
  .loader_container {
    height: 2px;
    width: 100%;
    margin-bottom: 3rem;
  }
  .page_loading_bar {
    background-color: black;
    border-radius: 0 20px 20px 0;
    height: 100%;
  }

  :global([data-theme="dark"]) .page_loading_bar {
    background-color: cyan;
  }
</style>
