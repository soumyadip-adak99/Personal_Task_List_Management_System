import { useState, useEffect, useRef } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useSelector, useDispatch } from "react-redux";
import { setColumns } from "./features/tasks/taskSlice";
import Columns from "./components/Columns";
import TaskCard from "./components/TaskCard";
import AddTaskForm from "./components/AddTaskForm";
import { Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";

const COLUMNS_CONFIG = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
];

export default function App() {
    const dispatch = useDispatch();
    const reduxTasks = useSelector((state) => state.tasks);

    const [tasks, setTasks] = useState(reduxTasks);
    const [activeId, setActiveId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const isDraggingRef = useRef(false);

    useEffect(() => {
        if (!isDraggingRef.current) {
            setTasks(reduxTasks);
        }
    }, [reduxTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function findContainer(id) {
        if (tasks[id]) return id;
        return Object.keys(tasks).find((key) => tasks[key].some((t) => t.id === id));
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        isDraggingRef.current = true;
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setTasks((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((t) => t.id === active.id);
            const overIndex = overItems.findIndex((t) => t.id === over.id);

            const newIndex = overIndex >= 0 ? overIndex : overItems.length;

            return {
                ...prev,
                [activeContainer]: activeItems.filter((t) => t.id !== active.id),
                [overContainer]: [
                    ...overItems.slice(0, newIndex),
                    activeItems[activeIndex],
                    ...overItems.slice(newIndex),
                ],
            };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (activeContainer === overContainer) {
            const items = tasks[activeContainer];
            const oldIndex = items.findIndex((t) => t.id === active.id);
            const newIndex = items.findIndex((t) => t.id === over.id);

            const reordered = arrayMove(items, oldIndex, newIndex);

            const newTasks = { ...tasks, [activeContainer]: reordered };

            setTasks(newTasks);
            dispatch(setColumns(newTasks));
        } else {
            dispatch(setColumns(tasks));
        }

        setActiveId(null);
        isDraggingRef.current = false;
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.5" } },
        }),
    };

    const activeTask = activeId
        ? Object.values(tasks)
              .flat()
              .find((t) => t.id === activeId)
        : null;

    return (
        <>
            <Toaster position="top-center" />
            <div className="min-h-screen bg-neutral-900 p-4 text-neutral-100 md:p-8">
                <div className="mx-auto max-w-7xl">
                    {/* header */}
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-white">Task Manager</h1>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 cursor-pointer"
                        >
                            <Plus /> Add Task
                        </button>
                    </div>

                    {/* board */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex flex-col gap-6 md:flex-row md:items-start">
                            {COLUMNS_CONFIG.map((col) => (
                                <Columns key={col.id} column={col} tasks={tasks[col.id]} />
                            ))}
                        </div>

                        <DragOverlay dropAnimation={dropAnimation}>
                            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                        </DragOverlay>
                    </DndContext>
                </div>

                {isModalOpen && <AddTaskForm onClose={() => setIsModalOpen(false)} />}
            </div>
        </>
    );
}
