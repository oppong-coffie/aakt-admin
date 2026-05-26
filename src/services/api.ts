const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aakt-backend-production.up.railway.app';

// Get token from localStorage
const getAuthToken = () => localStorage.getItem('auth_token');

// API request helper
const apiRequest = async (
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
};

// ==================== AUTHENTICATION ====================
export const authApi = {
    register: (email: string, password: string, name: string) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, fullName: name }),
        }, false),

    login: (email: string, password: string) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }, false),

    adminLogin: (email: string, password: string) =>
        apiRequest('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }, false),

    adminRegister: (fullName: string, email: string, password: string) =>
        apiRequest('/admin/register', {
            method: 'POST',
            body: JSON.stringify({ fullName, email, password }),
        }, false),

    verifyOtp: (otp: string) =>
        apiRequest('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ otp }),
        }, true),

    sendOtp: (email: string) =>
        apiRequest('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    googleLogin: (token: string) =>
        apiRequest('/auth/google-login', {
            method: 'POST',
            body: JSON.stringify({ token }),
        }, false),

    googleRegister: (token: string) =>
        apiRequest('/auth/google-register', {
            method: 'POST',
            body: JSON.stringify({ token }),
        }, false),

    getAllUsers: () =>
        apiRequest('/auth/getallusers', { method: 'GET' }),

    getUserById: (userId: string) =>
        apiRequest(`/auth/getuserbyid?userId=${userId}`, { method: 'GET' }),

    updateUser: (userId: string, data: Record<string, unknown>) =>
        apiRequest(`/auth/updateuser/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    deleteUser: (userId: string) =>
        apiRequest(`/auth/deleteuser/${userId}`, { method: 'DELETE' }),
};

// ==================== WORKLOADS ====================
export const workloadsApi = {
    create: (data: Record<string, unknown>) =>
        apiRequest('/workloads', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getAll: () =>
        apiRequest('/workloads', { method: 'GET' }),

    getByUserId: () =>
        apiRequest('/workloads/getworkloadsbyuserid', { method: 'GET' }),

    delete: (id: string) =>
        apiRequest(`/workloads/${id}`, { method: 'DELETE' }),

    archive: (id: string) =>
        apiRequest(`/workloads/${id}/archive`, { method: 'PATCH' }),

    setInProgress: (id: string) =>
        apiRequest(`/workloads/${id}/inprogress`, { method: 'PATCH' }),

    updateName: (id: string, name: string) =>
        apiRequest(`/workloads/${id}/name`, {
            method: 'PATCH',
            body: JSON.stringify({ name }),
        }),

    addTask: (workloadId: string, taskData: Record<string, unknown>) =>
        apiRequest(`/workloads/${workloadId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(taskData),
        }),

    removeTask: (workloadId: string, taskId: string) =>
        apiRequest(`/workloads/${workloadId}/tasks/${taskId}`, { method: 'DELETE' }),

    updateTaskName: (workloadId: string, taskId: string, name: string) =>
        apiRequest(`/workloads/${workloadId}/tasks/${taskId}/name`, {
            method: 'PATCH',
            body: JSON.stringify({ name }),
        }),

    completeTask: (workloadId: string, taskId: string) =>
        apiRequest(`/workloads/${workloadId}/tasks/${taskId}/complete`, { method: 'PATCH' }),

    setTaskTodo: (workloadId: string, taskId: string) =>
        apiRequest(`/workloads/${workloadId}/tasks/${taskId}/todo`, { method: 'PATCH' }),
};

// ==================== PORTFOLIO / BUSINESS ====================
export const portfolioApi = {
    // Business
    createBusiness: (data: Record<string, unknown>) =>
        apiRequest('/business', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getAllBusinesses: () =>
        apiRequest('/business', { method: 'GET' }),

    // Portfolio documents
    createPortfolioDocument: (data: Record<string, unknown>) =>
        apiRequest('/portfolio/documents', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Processes
    createProcess: (data: Record<string, unknown>) =>
        apiRequest('/portfolio/processes', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getProcessesByPhaseId: (phaseId: string) =>
        apiRequest(`/portfolio/processes/${phaseId}`, { method: 'GET' }),

    getProcessesByBusinessId: (businessId: string) =>
        apiRequest(`/portfolio/processes/all/${businessId}`, { method: 'GET' }),

    // Projects
    createProject: (data: Record<string, unknown>) =>
        apiRequest('/portfolio/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getProjectsByBusinessId: (businessId: string) =>
        apiRequest(`/portfolio/projects/${businessId}`, { method: 'GET' }),

    updateProjectFolder: (projectId: string, folderId: string) =>
        apiRequest(`/portfolio/projects/${projectId}/folder`, {
            method: 'PATCH',
            body: JSON.stringify({ folderId }),
        }),

    // Phases
    createPhase: (data: Record<string, unknown>) =>
        apiRequest('/portfolio/phases', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getPhasesByProjectId: (projectId: string) =>
        apiRequest(`/portfolio/phases/${projectId}`, { method: 'GET' }),

    getPhasesByBusinessId: (businessId: string) =>
        apiRequest(`/portfolio/phases/all/${businessId}`, { method: 'GET' }),
};

// ==================== BUSINESS ITEMS ====================
export const businessItemsApi = {
    // Tasks
    createTask: (data: Record<string, unknown>) =>
        apiRequest('/businessitems/task', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getTasksByBusinessId: (businessId: string) =>
        apiRequest(`/businessitems/task/${businessId}`, { method: 'GET' }),

    getTaskDetail: (taskId: string) =>
        apiRequest(`/businessitems/task/detail/${taskId}`, { method: 'GET' }),

    appendDocumentToTask: (taskId: string, documentData: Record<string, unknown>) =>
        apiRequest(`/businessitems/task/${taskId}/document`, {
            method: 'PATCH',
            body: JSON.stringify(documentData),
        }),

    appendFolderToTask: (taskId: string, folderId: string) =>
        apiRequest(`/businessitems/task/${taskId}/folder`, {
            method: 'PATCH',
            body: JSON.stringify({ folderId }),
        }),
};

// ==================== BUSINESS DOCUMENTS ====================
export const businessDocumentsApi = {
    create: (data: Record<string, unknown>) =>
        apiRequest('/businessdocuments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getByBusinessId: (businessId: string) =>
        apiRequest(`/businessdocuments/${businessId}`, { method: 'GET' }),

    getDetail: (documentId: string) =>
        apiRequest(`/businessdocuments/detail/${documentId}`, { method: 'GET' }),

    appendFolder: (documentId: string, folderId: string) =>
        apiRequest(`/businessdocuments/${documentId}/folder`, {
            method: 'PATCH',
            body: JSON.stringify({ folderId }),
        }),
};

// ==================== FOLDERS ====================
export const foldersApi = {
    create: (data: Record<string, unknown>) =>
        apiRequest('/folders', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getAll: () =>
        apiRequest('/folders', { method: 'GET' }),

    getById: (id: string) =>
        apiRequest(`/folders/${id}`, { method: 'GET' }),
};

// ==================== ONBOARDING ====================
export const onboardingApi = {
    createOrUpdate: (data: Record<string, unknown>) =>
        apiRequest('/onboarding', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateStage: (stage: string) =>
        apiRequest('/onboarding/stage', {
            method: 'POST',
            body: JSON.stringify({ stage }),
        }),

    updateStep: (step: string) =>
        apiRequest('/onboarding/step', {
            method: 'POST',
            body: JSON.stringify({ step }),
        }),

    updateSkills: (skills: { product?: string; strategy?: string; team?: string; finance?: string }) =>
        apiRequest('/onboarding/skills', {
            method: 'POST',
            body: JSON.stringify({ skills }),
        }),

    updateFeeling: (feeling: number[]) =>
        apiRequest('/onboarding/feeling', {
            method: 'POST',
            body: JSON.stringify({ feeling }),
        }),

    updateConfident: (confident: { capital?: number; influence?: number; intel?: number; network?: number; skillset?: number }) =>
        apiRequest('/onboarding/confident', {
            method: 'POST',
            body: JSON.stringify({ confident }),
        }),
};

// ==================== ADMIN ====================
export const adminApi = {
    register: (email: string, password: string, name: string) =>
        apiRequest('/admin/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, fullName: name }),
        }, false),

    login: (email: string, password: string) =>
        apiRequest('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }, false),

    getAllUsers: () =>
        apiRequest('/admin/users', { method: 'GET' }),

    getAllAdmins: () =>
        apiRequest('/admin/users', { method: 'GET' }),

    getAllOnboardings: () =>
        apiRequest('/admin/onboardings', { method: 'GET' }),

    createOnboarding: (data: {
        country: string;
        numberofbusinesses: number;
        teamsize: string;
        referralcode?: string;
        otp?: number;
        stage: string;
        product: string;
        strategy: string;
        team: string;
        finance: string;
        growth: string;
    }) =>
        apiRequest('/onboarding', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getAllBusinesses: () =>
        apiRequest('/admin/businesses', { method: 'GET' }),

    // Admin Workloads
    createAdminWorkload: (data: Record<string, unknown>) =>
        apiRequest('/admin/workloads', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getAdminWorkloads: () =>
        apiRequest('/admin/workloads', { method: 'GET' }),

    updateAdminWorkload: (id: string, data: Record<string, unknown>) =>
        apiRequest(`/admin/workloads/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    deleteAdminWorkload: (id: string) =>
        apiRequest(`/admin/workloads/${id}`, { method: 'DELETE' }),

    createAdminWorkloadTask: (workloadId: string, data: Record<string, unknown>) =>
        apiRequest(`/admin/workloads/${workloadId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    deleteAdminWorkloadTask: (workloadId: string, taskId: string) =>
        apiRequest(`/admin/workloads/${workloadId}/tasks/${taskId}`, { method: 'DELETE' }),

    updateAdminWorkloadTaskStatus: (workloadId: string, taskId: string, status: string) =>
        apiRequest(`/admin/workloads/${workloadId}/tasks/${taskId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    // User Workloads (regular endpoints)
    getWorkloads: () =>
        apiRequest('/workloads', { method: 'GET' }),

    createWorkload: (data: { workloadname: string; status: string; name?: string }) =>
        apiRequest('/workloads', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getWorkloadById: (id: string) =>
        apiRequest(`/workloads/${id}`, { method: 'GET' }),

    deleteWorkload: (id: string) =>
        apiRequest(`/workloads/${id}`, { method: 'DELETE' }),

    getWorkloadTasks: (workloadId: string) =>
        apiRequest(`/workloads/${workloadId}/tasks`, { method: 'GET' }),

    createWorkloadTask: (workloadId: string, data: { taskname: string }) =>
        apiRequest(`/workloads/${workloadId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getWorkloadTask: (workloadId: string, taskId: string) =>
        apiRequest(`/workloads/${workloadId}/tasks/${taskId}`, { method: 'GET' }),

    updateWorkloadTaskStatus: (workloadId: string, taskId: string, status: string) =>
        apiRequest(`/workloads/${workloadId}/tasks/${taskId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    updateWorkloadTaskName: (workloadId: string, taskId: string, taskname: string) =>
        apiRequest(`/workloads/${workloadId}/tasks/${taskId}/name`, {
            method: 'PATCH',
            body: JSON.stringify({ taskname }),
        }),
};

// ==================== HOME ====================
export const homeApi = {
    getOnboardingCompleted: () =>
        apiRequest('/home/completed', { method: 'GET' }),
};
