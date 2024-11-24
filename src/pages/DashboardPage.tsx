import { AppSidebar } from "@/components/app-sidebar";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import api from "@/services/api";

const formatReadableDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  function getCurrentMonthYear() {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data.tasks);
  };

  const handleAddTask = async () => {
    await api.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  const toggleCompleteTask = async (task: any) => {
    try {
      await api.patch(`/tasks/${task.uuid}/complete`, {
        isCompleted: !task.isCompleted,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task completion:", err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task: any) => task.uuid === active.id);
      const newIndex = tasks.findIndex((task: any) => task.uuid === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setCurrentDate(getCurrentMonthYear());
  });

  const SortableTableRow = ({ task }: { task: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: task.uuid,
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <TableRow ref={setNodeRef} style={style} {...attributes}>
        <TableCell className="font-medium text-left">
          <div className="flex items-center space-x-2">
            <div
              {...listeners} // Add listeners for drag-and-drop
              className="cursor-grab"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 10h16M4 14h16"
                />
              </svg>
            </div>
            {task.isCompleted ? <s>{task.title}</s> : task.title}
          </div>
        </TableCell>
        <TableCell className="text-left">
          {task.isCompleted ? (
            <s>{formatReadableDate(task.createdAt)}</s>
          ) : (
            formatReadableDate(task.createdAt)
          )}
        </TableCell>
        <TableCell className="text-right relative flex justify-end space-x-2">
          <div
            className="flex items-center justify-center"
            onClick={() => {
              toggleCompleteTask(task);
            }}
          >
            <Checkbox checked={task.isCompleted} />
          </div>
          <TrashIcon
            className="w-5 cursor-pointer"
            onClick={() => {
              handleDeleteTask(task.uuid);
            }}
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{currentDate}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tasks.map((task: any) => task.uuid)}>
            <Table>
              <TableCaption>A list of your recent goals.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Title</TableHead>
                  <TableHead className="text-left">Date Created</TableHead>
                  <TableHead className="text-left"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task: any) => (
                  <SortableTableRow key={task.uuid} task={task} />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    Set your goals high, and don't stop until you get there. -
                    Bo Jackson
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </SortableContext>
        </DndContext>

        <Dialog>
          <DialogTrigger asChild>
            <div className="flex justify-end mt-2">
              <Button>Add Goal</Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Goal</DialogTitle>
              <DialogDescription>
                Remember to set your goals high.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  placeholder="Finish reading a book"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTask();
                }}
                type="submit"
                size="sm"
                className="px-3"
              >
                <span className="sr-only">Copy</span>
                Add
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-muted/50" />
            ))}
          </div>
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
