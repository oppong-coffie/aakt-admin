import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Eye, X, Search, MoreHorizontal, Edit2 } from 'lucide-react';
import { adminApi } from '../services/api';
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

const Workloads = () => {
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
            const data = await adminApi.getWorkloads();
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
            await adminApi.createWorkload({
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
            await adminApi.deleteWorkload(id);
            toast.success('Workload deleted successfully');
            await fetchWorkloads();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete workload');
        }
    };

    const handleAddTask = async () => {
        if (!newTaskName.trim() || !activeWorkloadId) return;
        try {
            await adminApi.createWorkloadTask(activeWorkloadId, { taskname: newTaskName.trim() });
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
            const tasks = await adminApi.getWorkloadTasks(workloadId);
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
            await adminApi.updateWorkloadTaskName(workloadId, taskId, editingTaskName.trim());
            toast.success('Task name updated successfully');
            setEditingTaskId(null);
            setEditingTaskName('');
            // Refresh tasks
            const tasks = await adminApi.getWorkloadTasks(workloadId);
            setWorkloadTasks(Array.isArray(tasks) ? tasks : (tasks.tasks || []));
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update task name');
        }
    };

    const startEditingTask = (task: Task) => {
        setEditingTaskId(task._id || task.id);
        setEditingTaskName(task.name);
    };

    const cancelEditingTask = () => {
        setEditingTaskId(null);
        setEditingTaskName('');
    };

    const filteredWorkloads = workloads.filter(w => {
        const name = w.name || w.workloadname || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (w.userId && w.userId.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    return (
        <div className="p-8 bg-[#f4f5f9] dark:bg-gray-900 min-h-full">
            <div className="mb-6">
                <h1 className="text-[28px] font-semibold text-gray-900 dark:text-white mb-6">Workloads</h1>
                
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="search by name or user ID..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-[260px] shadow-sm text-[14px] text-gray-800 dark:text-gray-200"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowNewWorkloadForm(true)}
                        className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        New Workload
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm min-h-[500px] overflow-visible">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">All Workloads</h3>
                
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    </div>
                ) : filteredWorkloads.length > 0 ? (
                    <div className="w-full">
                        {/* Table Header */}
                        <div className="grid grid-cols-8 gap-4 pb-4 text-[13px] font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 min-w-[900px]">
                            <div>Name</div>
                            <div>Status</div>
                            <div>Tasks</div>
                            <div>User ID</div>
                            <div>Created</div>
                            <div>Updated</div>
                            <div className="text-right">Actions</div>
                        </div>
                        
                        {/* Table Body */}
                        <div className="flex flex-col min-w-[900px]">
                            {filteredWorkloads.map((workload) => {
                                const workloadId = workload._id || workload.id;
                                return (
                                    <div 
                                        key={workloadId} 
                                        className="grid grid-cols-8 gap-4 py-4 text-[13px] text-gray-600 dark:text-gray-350 border-b border-gray-50 dark:border-gray-700/50 items-center hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors relative"
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {workload.name || workload.workloadname || 'Untitled'}
                                        </div>
                                        <div>
                                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                                                workload.status === 'active' || workload.status === 'In Progress' 
                                                    ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                    : workload.status === 'archived'
                                                    ? 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                                                    : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                            }`}>
                                                {workload.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                                            {workload.tasks?.length || 0} tasks
                                        </div>
                                        <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                                            {workload.userId || 'N/A'}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {workload.createdAt ? new Date(workload.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {workload.updatedAt ? new Date(workload.updatedAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                        <div className="relative text-right">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionRow(activeActionRow === workloadId ? null : workloadId);
                                                }}
                                                className="inline-flex w-8 h-6 bg-[#002df3] text-white rounded-md items-center justify-center hover:bg-blue-700 cursor-pointer"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                            
                                            {activeActionRow === workloadId && (
                                                <div ref={actionRef} className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 py-2 z-50 text-left">
                                                    <button 
                                                        onClick={() => {
                                                            setActiveWorkloadId(workloadId);
                                                            setNewTaskName('');
                                                            setShowNewTaskForm(true);
                                                            setActiveActionRow(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add Task
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            handleViewWorkload(workload);
                                                            setActiveActionRow(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            handleDeleteWorkload(workloadId);
                                                            setActiveActionRow(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Workload
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
                        <Eye className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">No workloads found.</p>
                    </div>
                )}
            </div>

            {/* Create Workload Modal */}
            {showNewWorkloadForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Workload</h2>
                                <button
                                    onClick={() => {
                                        setShowNewWorkloadForm(false);
                                        setNewWorkloadName('');
                                        setNewWorkloadStatus('In Progress');
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Workload Name
                                </label>
                                <input
                                    type="text"
                                    value={newWorkloadName}
                                    onChange={(e) => setNewWorkloadName(e.target.value)}
                                    placeholder="e.g., Sprint 1 Workload"
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    value={newWorkloadStatus}
                                    onChange={(e) => setNewWorkloadStatus(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="In Progress">In Progress</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="On Hold">On Hold</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                            <button
                                onClick={handleCreateWorkload}
                                disabled={creating || !newWorkloadName.trim()}
                                className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                {creating ? 'Creating...' : 'Create Workload'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewWorkloadForm(false);
                                    setNewWorkloadName('');
                                    setNewWorkloadStatus('In Progress');
                                }}
                                className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showNewTaskForm && activeWorkloadId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Task</h2>
                                <button
                                    onClick={() => {
                                        setShowNewTaskForm(false);
                                        setActiveWorkloadId(null);
                                        setNewTaskName('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Task Name
                            </label>
                            <input
                                type="text"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                placeholder="e.g., Complete documentation"
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newTaskName.trim()) {
                                        handleAddTask();
                                    }
                                }}
                            />
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                            <button
                                onClick={handleAddTask}
                                disabled={!newTaskName.trim()}
                                className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Add Task
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewTaskForm(false);
                                    setActiveWorkloadId(null);
                                    setNewTaskName('');
                                }}
                                className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors cursor-pointer"
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
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workload Details</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {selectedWorkload.name || selectedWorkload.workloadname}
                                    </p>
                                </div>
                                <button
                                    onClick={closeWorkloadDetail}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-3">
                                {workloadTasks.map((task) => {
                                    const taskId = task._id || task.id;
                                    const isEditing = editingTaskId === taskId;
                                    
                                    return (
                                        <div key={taskId} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            {isEditing ? (
                                                <div className="flex-1 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editingTaskName}
                                                        onChange={(e) => setEditingTaskName(e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleEditTaskName(selectedWorkload._id || selectedWorkload.id, taskId);
                                                            } else if (e.key === 'Escape') {
                                                                cancelEditingTask();
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleEditTaskName(selectedWorkload._id || selectedWorkload.id, taskId)}
                                                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditingTask}
                                                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 dark:text-white">{task.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">Status: {task.status}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => startEditingTask(task)}
                                                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Edit task name"
                                                    >
                                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workloads;
