// place files you want to import through the `$lib` alias in this folder.
import { writable } from "svelte/store";
import { ParseStatus, z } from "zod";
import type { Todo, TodoCreate } from "./typing";

/* -------------------------------- Constants ------------------------------- */
export const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
export const MAX_UPLOAD_SIZE = 1024 * 1024 * 1;

/* --------------------------------- Schemas -------------------------------- */

export const avatarSchema = z.object({
  avatar: z
    .instanceof(File, { message: "Please upload a file." })
    .refine((f) => {
      if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
        return false;
      } else if (f.size > MAX_UPLOAD_SIZE) {
        return false;
      } else {
        return true;
      }
    }, "Please upload a PNG or JPG file smaller than 1MB."),
});
// export const avatarSchema = z.object({
//   avatar: z
//     .custom<File>()
//     .refine((f) => f.size < 100_000, "Max 100kb upload size")
//     .refine((f) => ACCEPTED_FILE_TYPES.includes(f.type), "ERRRRR"),
// });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const profileSchema = z.object({
  username: z.string().min(8).optional(),
  website: z.string().url().optional(),
  avatar_url: z.string().optional(),
});

/* --------------------------------- Stores --------------------------------- */
export const isJSStore = writable(false);

export const userAvatarStore = writable<string | undefined | null>();

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
