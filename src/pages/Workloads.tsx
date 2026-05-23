import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle, Circle } from 'lucide-react';
import { workloadsApi } from '../services/api';

interface Task {
    id: string;
    name: string;
    completed: boolean;
    status: 'todo' | 'inprogress' | 'completed';
}

interface Workload {
    id: string;
    name: string;
    status: 'active' | 'inprogress' | 'archived';
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
}

const Workloads = () => {
    const [workloads, setWorkloads] = useState<Workload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newWorkloadName, setNewWorkloadName] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    const [activeWorkloadId, setActiveWorkloadId] = useState<string | null>(null);
    const [showNewWorkloadForm, setShowNewWorkloadForm] = useState(false);
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);

    useEffect(() => {
        fetchWorkloads();
    }, []);

    const fetchWorkloads = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await workloadsApi.getByUserId();
            setWorkloads(Array.isArray(data) ? data : data.workloads || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch workloads');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkload = async () => {
        if (!newWorkloadName.trim()) return;
        try {
            const newWorkload = await workloadsApi.create({ name: newWorkloadName, status: 'active' });
            setWorkloads([...workloads, newWorkload]);
            setNewWorkloadName('');
            setShowNewWorkloadForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create workload');
        }
    };

    const handleDeleteWorkload = async (id: string) => {
        try {
            await workloadsApi.delete(id);
            setWorkloads(workloads.filter(w => w.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete workload');
        }
    };

    const handleArchiveWorkload = async (id: string) => {
        try {
            await workloadsApi.archive(id);
            fetchWorkloads();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to archive workload');
        }
    };

    const handleAddTask = async () => {
        if (!newTaskName.trim() || !activeWorkloadId) return;
        try {
            const taskData = { name: newTaskName, status: 'todo' };
            const newTask = await workloadsApi.addTask(activeWorkloadId, taskData);
            setWorkloads(workloads.map(w =>
                w.id === activeWorkloadId ? { ...w, tasks: [...(w.tasks || []), newTask] } : w
            ));
            setNewTaskName('');
            setShowNewTaskForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add task');
        }
    };

    const handleCompleteTask = async (workloadId: string, taskId: string) => {
        try {
            await workloadsApi.completeTask(workloadId, taskId);
            fetchWorkloads();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to complete task');
        }
    };

    const handleDeleteTask = async (workloadId: string, taskId: string) => {
        try {
            await workloadsApi.removeTask(workloadId, taskId);
            setWorkloads(workloads.map(w =>
                w.id === workloadId ? { ...w, tasks: w.tasks.filter(t => t.id !== taskId) } : w
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete task');
        }
    };

    if (loading) {
        return (
            <div className="p-8 bg-[#f4f5f9] min-h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading workloads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#f4f5f9] dark:bg-gray-900 min-h-full">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workloads</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your workloads and tasks</p>
                    </div>
                    <button
                        onClick={() => setShowNewWorkloadForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Workload
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                        {error}
                    </div>
                )}

                {/* New Workload Form */}
                {showNewWorkloadForm && (
                    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newWorkloadName}
                                onChange={(e) => setNewWorkloadName(e.target.value)}
                                placeholder="Enter workload name..."
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={handleCreateWorkload}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setShowNewWorkloadForm(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Workloads List */}
                {workloads.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">No workloads yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {workloads.map((workload) => (
                            <div key={workload.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                {/* Workload Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{workload.name}</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {workload.tasks?.length || 0} tasks
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleArchiveWorkload(workload.id)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Archive"
                                        >
                                            <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWorkload(workload.id)}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-2 mb-4">
                                    {workload.tasks?.map((task) => (
                                        <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <button
                                                onClick={() => handleCompleteTask(workload.id, task.id)}
                                                className="flex-shrink-0"
                                            >
                                                {task.completed || task.status === 'completed' ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                                                )}
                                            </button>
                                            <span className={`flex-1 ${task.completed || task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                                {task.name}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteTask(workload.id, task.id)}
                                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Task Form */}
                                {activeWorkloadId === workload.id && showNewTaskForm ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newTaskName}
                                            onChange={(e) => setNewTaskName(e.target.value)}
                                            placeholder="Enter task name..."
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button
                                            onClick={handleAddTask}
                                            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowNewTaskForm(false);
                                                setActiveWorkloadId(null);
                                            }}
                                            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setActiveWorkloadId(workload.id);
                                            setShowNewTaskForm(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg font-medium transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Task
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Workloads;
