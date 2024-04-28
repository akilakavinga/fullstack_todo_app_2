<script>
  import { userAvatarStore } from "$lib";
</script>

<div class="avatar">
  <img
    class="avatar--image"
    src={$userAvatarStore ? $userAvatarStore : "default_avatar.png"}
    alt={$userAvatarStore ? "User Avatar" : "No Image"}
  />
</div>

<style>
  .avatar {
    width: 3rem;
    height: 3rem;
    display: flex;
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar--image {
    object-fit: cover;
  }
</style>
