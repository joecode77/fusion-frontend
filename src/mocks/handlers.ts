import { http } from "msw";

interface Task {
  uuid: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

const tasks: Task[] = [
  { uuid: "1", title: "Task 1", isCompleted: false, createdAt: "2023-01-01" },
  { uuid: "2", title: "Task 2", isCompleted: true, createdAt: "2023-01-02" },
];

export const handlers = [
  http.get("/tasks", ({ request }) => {
    return new Response(JSON.stringify({ tasks }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),

  http.post("/tasks", async ({ request }) => {
    const body = await request.json();
    const { title } = body as { title: string };
    const newTask: Task = {
      uuid: String(tasks.length + 1),
      title,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);

    return new Response(JSON.stringify({ task: newTask }), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  }),

  http.patch("/tasks/:id", async ({ request, params }) => {
    const { id } = params;
    const body = await request.json();
    const { isCompleted } = body as { isCompleted: boolean };

    const task = tasks.find((task) => task.uuid === id);
    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    task.isCompleted = isCompleted;

    return new Response(JSON.stringify({ task }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }),

  // DELETE /tasks/:id - Delete a task
  http.delete("/tasks/:id", ({ params }) => {
    const { id } = params; // Access route params
    const taskIndex = tasks.findIndex((task) => task.uuid === id);

    if (taskIndex === -1) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    tasks.splice(taskIndex, 1);

    return new Response(null, { status: 204 });
  }),
];
