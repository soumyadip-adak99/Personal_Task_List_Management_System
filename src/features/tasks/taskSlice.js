import { createSlice, nanoid } from "@reduxjs/toolkit";

const DEFAULT_STATE = {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
};

const loadState = () => {
    try {
        const saved = localStorage.getItem("task-state");

        if (!saved) return DEFAULT_STATE;

        const parsed = JSON.parse(saved);

        return {
            TODO: parsed.TODO || [],
            IN_PROGRESS: parsed.IN_PROGRESS || [],
            DONE: parsed.DONE || [],
        };
    } catch (err) {
        console.error("Failed to load state", err);
        return DEFAULT_STATE;
    }
};

const saveState = (state) => {
    try {
        localStorage.setItem("task-state", JSON.stringify(state));
    } catch (err) {
        console.error("Failed to save state", err);
    }
};

const initialState = loadState();

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask(state, action) {
            const { columnId, title, description } = action.payload;

            state[columnId].push({
                id: nanoid(),
                title,
                description,
            });

            saveState(state);
        },

        deleteTask(state, action) {
            const { columnId, taskId } = action.payload;

            state[columnId] = state[columnId].filter((task) => task.id !== taskId);

            saveState(state);
        },

        updateTask(state, action) {
            const { columnId, taskId, newTitle, newDescription } = action.payload;

            const task = state[columnId].find((t) => t.id === taskId);

            if (task) {
                if (newTitle !== undefined) task.title = newTitle;
                if (newDescription !== undefined) task.description = newDescription;
            }

            saveState(state);
        },

        setColumns(state, action) {
            const newState = action.payload;

            state.TODO = newState.TODO || [];
            state.IN_PROGRESS = newState.IN_PROGRESS || [];
            state.DONE = newState.DONE || [];

            saveState(state);
        },
    },
});

export const { addTask, deleteTask, updateTask, setColumns } = taskSlice.actions;

export default taskSlice.reducer;
