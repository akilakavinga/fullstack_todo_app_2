<script lang="ts">
  import { isJSStore, userAvatarStore } from "$lib";
  import { downloadAvatar } from "$lib/utils.js";
  import { superForm } from "sveltekit-superforms";

  /* -------------------------------- Variables ------------------------------- */
  export let data;
  let { profile, supabase } = data;
  let avatarUrl: string | null | undefined;
  $: ({ profile, supabase } = data);
  $: {
    if (profile.avatar_url) {
      const x = downloadAvatar(profile.avatar_url, supabase).then((url) => {
        avatarUrl = url;
        $userAvatarStore = url;
      });
    }
  }

  /* ------------------------------- Super Forms ------------------------------ */
  const { form, errors, enhance, posted, submitting, submit } = superForm(
    data.profileForm
  );
  const {
    form: avatarForm,
    errors: avatarErrors,
    submit: submitAvatar,
    enhance: enhanceAvatar,
    submitting: avatarSubmitting,
  } = superForm(data.avatarForm);

  /* -------------------------------- Functions ------------------------------- */
  function handleAvatarInput(e: Event) {
    $avatarForm.avatar = (e.currentTarget as HTMLInputElement).files?.item(
      0
    ) as File;
    submitAvatar();
  }

  // async function downloadAvatar(path: string) {
  //   const { data, error } = await supabase.storage
  //     .from("avatars")
  //     .download(path);

  //   if (error) {
  //     throw error;
  // }

  //   const url = URL.createObjectURL(data);
  //   avatarUrl = url;
  // }
</script>

<form
  method="post"
  enctype="multipart/form-data"
  action="?/update_avatar"
  class="avatar_form"
  aria-busy={$avatarSubmitting}
  use:enhanceAvatar
>
  <label>
    Avatar
    <div class="avatar">
      <img
        src={avatarUrl ? avatarUrl : "default_avatar.png"}
        alt={avatarUrl ? "User Avatar" : "No Image"}
        class="avatar--image"
      />
      <input
        class="avatar--input"
        type="file"
        name="avatar"
        accept="image/png, image/jpeg"
        aria-disabled={$avatarSubmitting || !$isJSStore}
        disabled={$avatarSubmitting || !$isJSStore}
        aria-invalid={$avatarErrors.avatar ? "true" : null}
        on:input={handleAvatarInput}
      />
      <small style="grid-column: 1 / span 2; height: 1.5rem"
        >{$avatarErrors.avatar ? $avatarErrors.avatar : ""}</small
      >
    </div>
  </label>
</form>
<form
  method="post"
  action="?/update_profile"
  enctype="multipart/form-data"
  class="profile"
  use:enhance
>
  <fieldset>
    <label>
      Username
      <input
        name="username"
        placeholder={profile.username ? profile.username : "Enter Username"}
        autocomplete="username"
        bind:value={$form.username}
        aria-invalid={$posted ? ($errors.username ? "true" : null) : null}
        disabled={$submitting}
        aria-disabled={$submitting}
      />
      <small style="height: 1.5rem;"
        >{$errors.username ? $errors.username : ""}</small
      >
    </label>
    <label
      >Website
      <input
        name="website"
        bind:value={$form.website}
        placeholder={profile.website ? profile.website : "Enter Website"}
        autocomplete="work"
        aria-invalid={$posted ? ($errors.website ? "true" : null) : null}
        disabled={$submitting}
        aria-disabled={$submitting}
      />
      <small style="height: 1.5rem;"
        >{$errors.website ? $errors.website : ""}</small
      >
    </label>
  </fieldset>
  <button
    type="submit"
    disabled={$isJSStore &&
      ($submitting || (!$form.username && !$form.website))}
    aria-disabled={$isJSStore &&
      ($submitting || (!$form.username && !$form.website))}
    aria-busy={$submitting}>{$submitting ? "" : "Update"}</button
  >
</form>

<style>
  .avatar_form {
    width: 25rem;
    text-align: left;
    margin-bottom: 0.3rem;
  }
  .profile {
    width: 25rem;
    text-align: start;
  }

  .avatar * {
    margin: 0;
  }

  .avatar {
    display: grid;
    grid-template-columns: 1fr 6fr;
    place-items: center;
    padding: 0.75rem 0 0;
    column-gap: 0.75rem;
  }

  .avatar--image {
    object-fit: cover;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
</style>
