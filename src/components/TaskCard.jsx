import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../features/tasks/taskSlice";
import { Trash, SquarePen, Check, X } from "lucide-react";
import toast from "react-hot-toast";

function TaskCard({ task, columnId, isOverlay }) {
    const dispatch = useDispatch();

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { type: "Task", task },
        disabled: isOverlay,
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description);

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            dispatch(deleteTask({ columnId, taskId: task.id }));
            toast.success("Task deleted");
        } catch (error) {
            toast.error("Something went wrong while delete task");
            console.log(error);
        }
    };

    const handleEditStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleEditCancel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(false);
        setEditTitle(task.title);
        setEditDesc(task.description);
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            dispatch(
                updateTask({
                    columnId,
                    taskId: task.id,
                    newTitle: editTitle,
                    newDescription: editDesc,
                })
            );
            setIsEditing(false);
            toast.success("Task updated");
        } catch (error) {
            toast.error("Something went wrong while update task");
            console.log(error);
        }
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="h-24 rounded-lg border-2 border-dashed border-neutral-600 bg-neutral-700/50 opacity-50"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(!isEditing && attributes)}
            {...(!isEditing && listeners)}
            className={`group mt-2 relative flex flex-col justify-between cursor-grab rounded-lg bg-neutral-700/50 p-4 shadow-sm ring-1 ring-neutral-700 transition-all hover:ring-neutral-600 hover:shadow-md 
                ${
                    isOverlay
                        ? "rotate-2 scale-105 cursor-grabbing shadow-xl ring-2 ring-blue-500/50 z-50"
                        : ""
                }`}
        >
            {isEditing ? (
                <>
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded bg-neutral-800 px-2 py-1 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="mt-2 w-full rounded bg-neutral-800 px-2 py-1 text-neutral-200 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                        <button
                            onClick={handleEditCancel}
                            className="rounded bg-neutral-700 px-3 py-1 text-neutral-300 hover:bg-neutral-600 cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                        <button
                            onClick={handleEditSave}
                            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-500 cursor-pointer"
                        >
                            <Check size={18} />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <h3 className="pr-14 font-semibold text-neutral-100 leading-tight">
                            {task.title}
                        </h3>
                        <p className="mt-2 text-sm text-neutral-400 line-clamp-3">
                            {task.description}
                        </p>
                    </div>

                    {!isOverlay && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                                onClick={handleEditStart}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="rounded p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-blue-400 transition-colors cursor-pointer"
                                title="Edit Task"
                            >
                                <SquarePen size={20} />
                            </button>

                            <button
                                onClick={handleDelete}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="rounded p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-red-400 transition-colors cursor-pointer"
                                title="Delete Task"
                            >
                                <Trash size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default TaskCard;
