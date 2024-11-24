import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/pages/DashboardPage"; // Adjust based on your file structure
import { server } from "@/mocks/server"; // MSW mock server for handling API requests
import { rest } from "msw";

// Extend the mock server to simulate additional scenarios
beforeAll(() => server.listen()); // Start the mock server
afterEach(() => server.resetHandlers()); // Reset handlers after each test
afterAll(() => server.close()); // Clean up the mock server after tests

describe("DashboardPage Integration Tests", () => {
  it("should fetch and display tasks on initial render", async () => {
    // Render the DashboardPage component
    render(<DashboardPage />);

    // Verify the loading state (optional if you have a spinner or loading text)
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();

    // Wait for tasks to be loaded from the API
    expect(await screen.findByText("Task 1")).toBeInTheDocument();
    expect(await screen.findByText("Task 2")).toBeInTheDocument();

    // Ensure the tasks are displayed with their correct titles
    const taskItems = screen.getAllByRole("listitem");
    expect(taskItems).toHaveLength(2);
    expect(taskItems[0]).toHaveTextContent("Task 1");
    expect(taskItems[1]).toHaveTextContent("Task 2");
  });

  it("should allow adding a new task", async () => {
    // Render the DashboardPage component
    render(<DashboardPage />);

    // Locate the input field and button for adding tasks
    const input = screen.getByPlaceholderText("Add a task");
    const addButton = screen.getByRole("button", { name: "Add Task" });

    // Simulate typing a new task title
    userEvent.type(input, "New Task");

    // Ensure the input reflects the typed value
    expect(input).toHaveValue("New Task");

    // Simulate clicking the "Add Task" button
    userEvent.click(addButton);

    // Wait for the new task to be displayed in the list
    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });

    // Ensure the input is cleared after adding the task
    expect(input).toHaveValue("");
  });

  it("should handle task completion toggling", async () => {
    // Render the DashboardPage component
    render(<DashboardPage />);

    // Wait for the tasks to be loaded
    const task1Checkbox = await screen.findByRole("checkbox", {
      name: "Task 1",
    });

    // Ensure the checkbox is initially unchecked
    expect(task1Checkbox).not.toBeChecked();

    // Simulate toggling the checkbox
    userEvent.click(task1Checkbox);

    // Wait for the state to update (if your API responds asynchronously)
    await waitFor(() => {
      expect(task1Checkbox).toBeChecked();
    });
  });

  it("should allow deleting a task", async () => {
    // Render the DashboardPage component
    render(<DashboardPage />);

    // Wait for the tasks to be loaded
    const deleteButton = await screen.findByRole("button", {
      name: "Delete Task 1",
    });

    // Simulate clicking the delete button
    userEvent.click(deleteButton);

    // Ensure the task is removed from the list
    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });
  });

  it("should display an error message if fetching tasks fails", async () => {
    // Override the default mock server response for this test
    server.use(
      rest.get("/tasks", (_req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: "Failed to fetch tasks" })
        );
      })
    );

    // Render the DashboardPage component
    render(<DashboardPage />);

    // Verify that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText("Failed to fetch tasks")).toBeInTheDocument();
    });
  });
});
