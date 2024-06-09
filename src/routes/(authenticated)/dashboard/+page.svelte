<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { isJSStore, todoStore } from "$lib";
  import CancelIcon from "$lib/components/CancelIcon.svelte";
  import CheckIcon from "$lib/components/CheckIcon.svelte";
  import TrashIcon from "$lib/components/TrashIcon.svelte";
  import type { Todo, TodoCreate } from "$lib/typing.js";
  import type { SubmitFunction } from "@sveltejs/kit";

  /* ----------------------------- Init Todo Store ---------------------------- */
  export let data;
  todoStore.set(data.todos!);

  /* -------------------------------- Variables ------------------------------- */
  const { id: user_id } = data?.user;
  let new_task: string;
  let filter: "all" | "complete" | "active" = "all";
  let focusedTodo: string | undefined = undefined;
  let filteredTodos = $todoStore;

  /* ------------------------------ Filter Effect ----------------------------- */
  const active = (todo: TodoCreate) => !todo.is_complete;
  const completed = (todo: TodoCreate) => todo.is_complete;

  $: {
    filteredTodos =
      filter === "all"
        ? $todoStore
        : $todoStore.filter(filter === "active" ? active : completed);
  }

  /* ---------------------------- Submit Functions ---------------------------- */
  const AddSubmitFunction: SubmitFunction = () => {
    const temp: TodoCreate = {
      id: crypto.randomUUID(),
      user_id,
      task: new_task,
    };
    const id = todoStore.add(temp)!;

    return async ({ update, result }) => {
      if (result.type === "success") {
        const sent_todo = result.data as Todo;
        todoStore.updateTodo(id, sent_todo);
      } else {
        todoStore.remove(id);
      }
      await applyAction(result);
    };
  };

  const TodoSubmitFunctions: SubmitFunction = ({ action, formElement }) => {
    const id = action.searchParams.get("id")!;
    const new_task = action.searchParams.get("new_task") as string;
    const form_action = action.search.split("&")[0];

    let old_todo = $todoStore.find((_todo) => _todo.id === id)!;

    if (form_action === "?/complete_todo") {
      todoStore.toggle(id);
    } else if (form_action === "?/delete_todo") {
      todoStore.remove(id);
    } else if (form_action === "?/edit_task") {
      todoStore.updateTask(id, new_task);
    }

    return async ({ update, result }) => {
      if (form_action === "?/complete_todo") {
        if (result.type !== "success") {
          todoStore.toggle(id);
        }
      } else if (form_action === "?/delete_todo") {
        if (result.type !== "success") {
          todoStore.add(old_todo);
        }
      } else if (form_action === "?/edit_task") {
        if (result.type !== "success") {
          todoStore.updateTask(id, old_todo.task!);
        }
      }
      // await update({ invalidateAll: false });
      // await applyAction(result);
    };
  };

  function handleFocusOut(event: FocusEvent, todo: TodoCreate) {
    focusedTodo = undefined;
    const target = event.target as HTMLInputElement;
    if (todo.task !== target.value) {
      const form = target.closest("form");
      if (form) {
        form.action = `?/edit_task&id=${todo.id}&new_task=${target.value}`;
        form.dispatchEvent(new CustomEvent("submit"));
      }
    }
  }
</script>

<div class="container">
  <form method="post" use:enhance={AddSubmitFunction}>
    <input
      bind:value={new_task}
      type="text"
      name="task"
      aria-label="task"
      placeholder="Enter task here..."
      required
      aria-required="true"
    />
    <button type="submit" formaction="?/add_todo" class="outline"
      ><strong>ADD</strong></button
    >
  </form>
  <hr />
  <div role="group">
    <button
      aria-disabled={!$isJSStore}
      disabled={!$isJSStore}
      class:outline={filter !== "all"}
      style="flex: 1"
      on:click={() => {
        filter = "all";
      }}>All</button
    >
    <button
      aria-disabled={!$isJSStore}
      disabled={!$isJSStore}
      class:outline={filter !== "active"}
      style="flex: 1"
      on:click={() => {
        filter = "active";
      }}>Active</button
    >
    <button
      aria-disabled={!$isJSStore}
      disabled={!$isJSStore}
      class:outline={filter !== "complete"}
      style="flex: 1"
      on:click={() => {
        filter = "complete";
      }}>Complete</button
    >
  </div>
  <hr />
  <form method="post" use:enhance={TodoSubmitFunctions}>
    {#each filteredTodos as todo, i (i)}
      <!-- svelte-ignore a11y-no-redundant-roles -->
      <fieldset role="group">
        <input
          type="text"
          value={todo.task}
          aria-disabled={todo.is_complete ||
            !todo.inserted_at ||
            !$isJSStore ||
            (focusedTodo !== todo.id && !!focusedTodo)}
          disabled={todo.is_complete ||
            !todo.inserted_at ||
            !$isJSStore ||
            (focusedTodo !== todo.id && !!focusedTodo)}
          style={todo.is_complete ? "text-decoration: line-through;" : ""}
          on:focusin={() => {
            focusedTodo = todo.id;
          }}
          on:blur={(e) => {
            handleFocusOut(e, todo);
          }}
        />
        <button
          formaction={`?/complete_todo&id=${todo.id}&is_complete=${!todo.is_complete}`}
          class:secondary={todo.is_complete}
          disabled={!todo.inserted_at}
          aria-disabled={!todo.inserted_at}
          class="iconBtn"
        >
          {#if todo.is_complete}
            <CancelIcon />
          {:else}
            <CheckIcon />
          {/if}
        </button>
        <button
          style="background-color: darkred; border-color: darkred"
          formaction={`?/delete_todo&id=${todo.id}`}
          disabled={!todo.inserted_at}
          aria-disabled={!todo.inserted_at}
          class="iconBtn"><TrashIcon /></button
        >
      </fieldset>
    {/each}
  </form>
</div>

<style>
  .iconBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    max-width: 4rem;
  }
</style>
