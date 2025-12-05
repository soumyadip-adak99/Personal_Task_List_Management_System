import React from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../features/tasks/taskSlice";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const COLUMNS_CONFIG = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
];

export default function AddTaskForm({ onClose }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        columnId: "TODO",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            if (!formData.title.trim()) return;

            dispatch(
                addTask({
                    columnId: formData.columnId,
                    title: formData.title,
                    description: formData.description,
                })
            );
            toast.success("Successfully add your task");
            onClose();
        } catch (error) {
            toast.error("Something went wrong");
            console.log("error");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-800 p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Add Task</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white">
                        <X />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm mb-1 text-neutral-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white focus:border-blue-500"
                            placeholder="e.g., Fix dashboard bug"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-neutral-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white resize-none focus:border-blue-500"
                            placeholder="Add details about the task..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-neutral-300">Status</label>
                        <select
                            name="columnId"
                            value={formData.columnId}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white focus:border-blue-500"
                        >
                            {COLUMNS_CONFIG.map((col) => (
                                <option key={col.id} value={col.id}>
                                    {col.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-neutral-300 hover:bg-neutral-700 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
