<script lang="ts">
  import "$lib/main.scss";
  import { onMount } from "svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import PageLoaderBar from "$lib/components/PageLoaderBar.svelte";
  import { isJSStore, userAvatarStore } from "$lib";
  import { downloadAvatar } from "$lib/utils.js";

  export let data;
  $: if (data.user) {
    downloadAvatar(data.user?.user_metadata.avatar_url, data.supabase).then(
      (res) => {
        $userAvatarStore = res;
      }
    );
  }

  onMount(async () => {
    $isJSStore = true;
  });
</script>

<header class="">
  <Navbar isLoggedIn={!!data.user} />
  <PageLoaderBar />
</header>
<main class="main_container">
  <slot />
</main>
<footer>
  Javascript: <strong
    class="js_status"
    class:enabled={$isJSStore}
    class:disabled={!$isJSStore}>{$isJSStore ? "ON" : "OFF"}</strong
  >
</footer>

<style>
  .enabled {
    color: greenyellow;
  }

  .disabled {
    color: crimson;
  }
  :global(body) {
    height: 100vh;
  }
  .main_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    text-align: center;
    padding-bottom: 60px;
  }

  footer {
    text-align: center;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding-block: 10px;
  }
</style>
