// place files you want to import through the `$lib` alias in this folder.
import { writable } from "svelte/store";
import { ParseStatus, z } from "zod";
import type { Todo, TodoCreate } from "./typing";

/* --------------------------------- Schemas -------------------------------- */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/* --------------------------------- Stores --------------------------------- */
export const isJSStore = writable(false);

const createTodoStore = () => {
  const { subscribe, update, set } = writable<TodoCreate[]>();

  function add(new_todo: TodoCreate) {
    update((_todos) => {
      _todos?.unshift(new_todo);
      return _todos;
    });

    return new_todo.id;
  }

  function remove(id: string) {
    update((_todos) => {
      _todos = _todos?.filter((_todo) => _todo.id !== id);
      return _todos;
    });
  }

  function updateTodo(id: string, todo: Todo) {
    update((_todos) => _todos.map((_todo) => (_todo.id === id ? todo : _todo)));
  }

  function updateTask(id: string, task: string) {
    update((_todos) =>
      _todos.map((_todo) => (_todo.id === id ? { ..._todo, task } : _todo))
    );
  }

  function toggle(id: string) {
    update((_todos) =>
      _todos.map((_todo) =>
        _todo.id === id ? { ..._todo, is_complete: !_todo.is_complete } : _todo
      )
    );
  }

  return { subscribe, set, add, remove, updateTodo, toggle, updateTask };
};
export const todoStore = createTodoStore();
