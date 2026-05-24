import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Eye, X, Search, MoreHorizontal } from 'lucide-react';
import { workloadsApi } from '../services/api';
import { toast } from '../components/Toast';

interface Task {
    _id?: string;
    id: string;
    name: string;
    completed: boolean;
    status: 'todo' | 'inprogress' | 'completed';
}

interface Workload {
    _id?: string;
    id: string;
    name: string;
    workloadname?: string;
    status: string;
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
    userId?: string;
}

const UserWorkloads = () => {
    const [workloads, setWorkloads] = useState<Workload[]>([]);
    const [loading, setLoading] = useState(true);
    const [newWorkloadName, setNewWorkloadName] = useState('');
    const [newWorkloadStatus, setNewWorkloadStatus] = useState('In Progress');
    const [newTaskName, setNewTaskName] = useState('');
    const [activeWorkloadId, setActiveWorkloadId] = useState<string | null>(null);
    const [showNewWorkloadForm, setShowNewWorkloadForm] = useState(false);
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [selectedWorkload, setSelectedWorkload] = useState<Workload | null>(null);
    const [workloadTasks, setWorkloadTasks] = useState<Task[]>([]);
    const [showWorkloadDetail, setShowWorkloadDetail] = useState(false);
    const [creating, setCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTaskName, setEditingTaskName] = useState('');
    const [activeActionRow, setActiveActionRow] = useState<string | null>(null);
    const actionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
                setActiveActionRow(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchWorkloads();
    }, []);

    const fetchWorkloads = async () => {
        try {
            setLoading(true);
            const data = await workloadsApi.getAll();
            const workloadList = Array.isArray(data) ? data : (data.workloads || data.data || []);
            setWorkloads(workloadList);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to fetch workloads');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkload = async () => {
        if (!newWorkloadName.trim()) return;
        try {
            setCreating(true);
            await workloadsApi.create({
                workloadname: newWorkloadName.trim(),
                status: newWorkloadStatus,
                name: newWorkloadName.trim(),
            });
            setNewWorkloadName('');
            setNewWorkloadStatus('In Progress');
            setShowNewWorkloadForm(false);
            toast.success('Workload created successfully');
            await fetchWorkloads();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to create workload');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteWorkload = async (id: string) => {
        if (!confirm('Are you sure you want to delete this workload?')) return;
        try {
            await workloadsApi.delete(id);
            toast.success('Workload deleted successfully');
            await fetchWorkloads();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete workload');
        }
    };

    const handleAddTask = async () => {
        if (!newTaskName.trim() || !activeWorkloadId) return;
        try {
            await workloadsApi.addTask(activeWorkloadId, { taskname: newTaskName.trim() });
            setNewTaskName('');
            setShowNewTaskForm(false);
            setActiveWorkloadId(null);
            toast.success('Task added successfully');
            await fetchWorkloads();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to add task');
        }
    };

    const handleViewWorkload = async (workload: Workload) => {
        try {
            const workloadId = workload._id || workload.id;
            const tasks = await workloadsApi.addTask(workloadId, { taskname: '' });
            setSelectedWorkload(workload);
            setWorkloadTasks(Array.isArray(tasks) ? tasks : (tasks.tasks || []));
            setShowWorkloadDetail(true);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to fetch workload tasks');
        }
    };

    const closeWorkloadDetail = () => {
        setShowWorkloadDetail(false);
        setSelectedWorkload(null);
        setWorkloadTasks([]);
        setEditingTaskId(null);
        setEditingTaskName('');
    };

    const handleEditTaskName = async (workloadId: string, taskId: string) => {
        if (!editingTaskName.trim()) return;
        try {
            await workloadsApi.updateTaskName(workloadId, taskId, editingTaskName.trim());
            toast.success('Task name updated successfully');
            setEditingTaskId(null);
            setEditingTaskName('');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update task name');
        }
    };

    const filteredWorkloads = workloads.filter((w) => {
        const name = (w.name || w.workloadname || '').toLowerCase();
        const status = (w.status || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || status.includes(query);
    });

    return (
        <div className="p-8 bg-white min-h-full">
            <h1 className="text-[28px] font-semibold text-gray-900 mb-6">My Workloads</h1>

            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="search workloads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] w-80"
                    />
                </div>
                <button
                    onClick={() => setShowNewWorkloadForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Create Workload
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px] overflow-visible">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Workloads</h3>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    </div>
                ) : filteredWorkloads.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        {/* Table Header */}
                        <div className="grid grid-cols-5 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[700px]">
                            <div>Name</div>
                            <div>Status</div>
                            <div>Tasks</div>
                            <div>Created</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Table Body */}
                        <div className="flex flex-col min-w-[700px]">
                            {filteredWorkloads.map((w) => {
                                const workloadId = w._id || w.id;
                                return (
                                    <div
                                        key={workloadId}
                                        className="grid grid-cols-5 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors relative"
                                    >
                                        <div className="font-medium text-gray-900">{w.name || w.workloadname}</div>
                                        <div>
                                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${w.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : w.status === 'Archive' ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-600'
                                                }`}>
                                                {w.status}
                                            </span>
                                        </div>
                                        <div>{w.tasks?.length || 0} tasks</div>
                                        <div className="text-[11px] text-gray-500">
                                            {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                        <div className="text-right relative" ref={actionRef}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionRow(activeActionRow === workloadId ? null : workloadId);
                                                }}
                                                className="inline-flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <MoreHorizontal className="w-4 h-4 text-gray-600" />
                                            </button>

                                            {activeActionRow === workloadId && (
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-[9999]">
                                                    <button
                                                        onClick={() => {
                                                            handleViewWorkload(w);
                                                            setActiveActionRow(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                                    >
                                                        <Eye className="w-4 h-4 text-blue-600" />
                                                        <span>View Details</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setActiveWorkloadId(workloadId);
                                                            setShowNewTaskForm(true);
                                                            setActiveActionRow(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                                    >
                                                        <Plus className="w-4 h-4 text-green-600" />
                                                        <span>Add Task</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteWorkload(workloadId);
                                                            setActiveActionRow(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-gray-500">No workloads found.</p>
                    </div>
                )}
            </div>

            {/* Create Workload Modal */}
            {showNewWorkloadForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Create New Workload</h2>
                                <button onClick={() => setShowNewWorkloadForm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Workload Name</label>
                                <input
                                    type="text"
                                    value={newWorkloadName}
                                    onChange={(e) => setNewWorkloadName(e.target.value)}
                                    placeholder="Enter workload name"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={newWorkloadStatus}
                                    onChange={(e) => setNewWorkloadStatus(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option>In Progress</option>
                                    <option>Todo</option>
                                    <option>Archive</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={handleCreateWorkload}
                                disabled={creating}
                                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                {creating ? 'Creating...' : 'Create Workload'}
                            </button>
                            <button
                                onClick={() => setShowNewWorkloadForm(false)}
                                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showNewTaskForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
                                <button onClick={() => { setShowNewTaskForm(false); setNewTaskName(''); }} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <input
                                type="text"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                placeholder="Enter task name"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={handleAddTask}
                                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Add Task
                            </button>
                            <button
                                onClick={() => { setShowNewTaskForm(false); setNewTaskName(''); }}
                                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Workload Detail Modal */}
            {showWorkloadDetail && selectedWorkload && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">{selectedWorkload.name || selectedWorkload.workloadname}</h2>
                                <button onClick={closeWorkloadDetail} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {workloadTasks.length > 0 ? (
                                <div className="space-y-3">
                                    {workloadTasks.map((task) => (
                                        <div key={task._id || task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            {editingTaskId === (task._id || task.id) ? (
                                                <input
                                                    type="text"
                                                    value={editingTaskName}
                                                    onChange={(e) => setEditingTaskName(e.target.value)}
                                                    onBlur={() => handleEditTaskName(selectedWorkload._id || selectedWorkload.id, task._id || task.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleEditTaskName(selectedWorkload._id || selectedWorkload.id, task._id || task.id)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="flex-1 text-gray-900">{task.name}</span>
                                            )}
                                            <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${task.status === 'completed' ? 'bg-green-50 text-green-600' : task.status === 'inprogress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">No tasks yet.</p>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={closeWorkloadDetail}
                                className="w-full px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserWorkloads;
