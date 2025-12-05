import { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

function Columns({ column, tasks, onEdit }) {
    const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    const { setNodeRef } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: true,
    });

    return (
        <div
            ref={setNodeRef}
            className="flex h-[600px] max-h-[80vh] w-full flex-col rounded-xl bg-neutral-800/50 border border-neutral-800 p-4 shadow-lg md:w-96"
        >
            <div className="mb-4 flex items-center justify-between px-1">
                <div
                    className={`flex items-center gap-2 w-full p-2 rounded-lg
                            ${
                                column.title === "To Do"
                                    ? "bg-red-950/50 border border-rose-900"
                                    : column.title === "In Progress"
                                    ? "bg-yellow-950/50 border border-yellow-900"
                                    : column.title === "Done"
                                    ? "bg-green-950/50 border border-green-900"
                                    : "bg-neutral-800"
                            }
                        `}
                >
                    <h2 className="font-bold text-neutral-100 uppercase tracking-wider text-sm">
                        {column.title}
                    </h2>

                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium
                            ${
                                column.title === "To Do"
                                    ? "bg-red-700 text-white"
                                    : column.title === "In Progress"
                                    ? "bg-yellow-700 text-white"
                                    : column.title === "Done"
                                    ? "bg-green-700 text-white"
                                    : "bg-neutral-600 text-neutral-200"
                            }
                        `}
                    >
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Task List */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-1 pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} columnId={column.id} onEdit={onEdit} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

export default Columns;
