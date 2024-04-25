<script lang="ts">
  import { page } from "$app/stores";
  import type { SubmitFunction } from "@sveltejs/kit";
  import MoonIcon from "./MoonIcon.svelte";
  import SunIcon from "./SunIcon.svelte";
  import { enhance } from "$app/forms";

  const themeSubmitFunction: SubmitFunction = () => {
    const curTheme = document.documentElement.dataset.theme as Theme;
    const changeToTheme = curTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", changeToTheme);

    return async ({ update }) => {
      // await update({ invalidateAll: false, reset: false });
    };
  };
</script>

<form method="post" use:enhance={themeSubmitFunction}>
  <button
    formaction={`/?/change_theme&theme=light&redirectTo=${$page.url.pathname}`}
    class="outline contrast theme_toggle sun"
  >
    <SunIcon />
  </button>
  <button
    formaction={`/?/change_theme&theme=dark&redirectTo=${$page.url.pathname}`}
    class="outline contrast theme_toggle moon"
  >
    <MoonIcon />
  </button>
</form>

<style>
  .theme_toggle {
    user-select: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    border: none;
    justify-content: center;
    align-items: center;
    padding: 5%;
  }

  @media (prefers-color-scheme: dark) {
    :global([data-theme="light"]) .sun {
      display: none;
    }
    :global([data-theme="dark"]) .moon {
      display: none;
    }
    :global(:root:not([data-theme])) .moon {
      display: none;
    }
    :global([data-theme=""]) .sun {
      display: none;
    }
  }
  @media (prefers-color-scheme: light) {
    :global([data-theme="dark"]) .moon {
      display: none;
    }
    :global([data-theme="light"]) .sun {
      display: none;
    }
    :global(:root:not([data-theme])) .sun {
      display: none;
    }
    :global([data-theme=""]) .sun {
      display: none;
    }
  }
</style>
