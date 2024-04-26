<script lang="ts">
  import SuperDebug, { superForm } from "sveltekit-superforms";
  export let data;

  const { form, errors, posted, enhance, submitting } = superForm(data.form);
</script>

<form method="POST" class="login" use:enhance>
  <h1>LOGIN</h1>
  <hr />
  <fieldset>
    <input
      bind:value={$form.email}
      type="text"
      name="email"
      placeholder="Email"
      aria-label="Email"
      autocomplete="email"
      aria-describedby="email-helper"
      aria-invalid={$posted ? ($errors.email ? "true" : "false") : null}
      disabled={$submitting}
    />
    <small id="email-helper" style="height: 20px;"
      >{$errors.email ? $errors.email : ""}</small
    >
    <input
      bind:value={$form.password}
      type="password"
      name="password"
      placeholder="Password"
      aria-label="Password"
      autocomplete="off"
      aria-describedby="password-helper"
      aria-invalid={$posted ? ($errors.password ? "true" : "false") : null}
      disabled={$submitting}
    />
    <small id="password-helper" style="height: 20px;"
      >{$errors.password ? $errors.password : ""}</small
    >
  </fieldset>
  <button type="submit" aria-busy={$submitting && true}
    >{!$submitting ? "Login" : ""}</button
  >
</form>

<style>
  .login {
    text-align: start;
    width: 25rem;
  }
</style>
