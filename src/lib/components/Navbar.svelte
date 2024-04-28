<script lang="ts">
  import Avatar from "./Avatar.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  export let isLoggedIn: Boolean;
</script>

<nav>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/profile">Profile</a></li>
  </ul>
  <ul>
    <li>
      <a class="contrast" href="/">
        <strong style="font-size: 2rem;">HOME</strong>
      </a>
    </li>
  </ul>
  <ul>
    {#if !isLoggedIn}
      <li role="group" style="margin: 0;">
        <a role="button" href="/login" class="outline reduce_size">Sign In</a>
        <a role="button" href="/register" class="reduce_size">Sign Up</a>
      </li>
    {:else}
      <li>
        <form action="/?/sign_out" method="post">
          <button class="secondary">Sign Out</button>
        </form>
      </li>
    {/if}
    {#if isLoggedIn}
      <li>
        <Avatar />
      </li>
    {/if}
    <li>
      <ThemeToggle />
    </li>
  </ul>
</nav>

<style>
  .reduce_size {
    font-size: 86%;
  }
</style>
