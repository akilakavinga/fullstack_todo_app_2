import type { Database } from "./database";

type Theme = "dark" | "light";
type Todo = Database["public"]["Tables"]["todos"]["Row"];
type TodoCreate = Database["public"]["Tables"]["todos"]["Insert"];
