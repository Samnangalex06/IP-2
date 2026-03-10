import { defineStore } from "pinia";

const API_URL = "http://localhost:3100";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),
  getters: {
    countTodos: (state) => state.todos.length,
  },
  actions: {
    async fetchTodos() {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const todos = await response.json();
        this.todos = todos;
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    },
    async toggleStatus(id) {
      const foundIndex = this.todos.findIndex((t) => t.id == id);
      if (foundIndex >= 0) {
        const task = this.todos[foundIndex];
        const endpoint = task.completedAt != null ? 'pending' : 'done';
        
        try {
          const response = await fetch(`${API_URL}/tasks/${id}/${endpoint}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          if (!response.ok) {
            throw new Error("Failed to update task");
          }
          
          const updatedTask = await response.json();
          this.todos[foundIndex] = updatedTask;
        } catch (error) {
          console.error("Error updating task:", error);
        }
      }
    },
    async addTodo(todo) {
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: todo,
            description: "description",
            userId: 1, // Default user ID
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to create task");
        }
        
        const newTask = await response.json();
        this.todos.push(newTask);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    },
    async clearAll() {
      try {
        // Delete all tasks
        const deletePromises = this.todos.map(async (todo) => {
          const response = await fetch(`${API_URL}/tasks/${todo.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error(`Failed to delete task ${todo.id}`);
          }
          return response;
        });
        
        await Promise.all(deletePromises);
        
        // Clear local state after successful deletion
        this.todos = [];
        
        // Optionally refresh from server to ensure consistency
        await this.fetchTodos();
      } catch (error) {
        console.error("Error deleting tasks:", error);
        // Refresh from server in case of partial deletion
        await this.fetchTodos();
      }
    },
  },
});
