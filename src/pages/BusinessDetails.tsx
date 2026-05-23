import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building, Folder, FileText, CheckSquare, Plus, ExternalLink, 
  Layers, Info, FolderPlus, FilePlus, User, Globe, Users, Briefcase, ChevronRight
} from 'lucide-react';
import { 
  portfolioApi, foldersApi, businessDocumentsApi, businessItemsApi, adminApi 
} from '../services/api';

interface BusinessData {
  _id: string;
  businessName: string;
  bizConcept?: {
    product: string;
    customer: string;
    goToMarket: string[];
    culture: string;
  };
  product?: string;
  customer?: string;
  goToMarket?: string[];
  culture?: string;
  userid: string;
  createdAt?: string;
}

interface ProjectData {
  _id: string;
  projectName: string;
  projectDescription?: string;
  folderId?: string;
}

interface PhaseData {
  _id: string;
  phaseName: string;
  projectId: string;
}

interface FolderData {
  _id: string;
  folderName: string;
}

interface DocumentData {
  _id: string;
  name: string;
  url: string;
  folderId?: string;
}

interface TaskData {
  _id: string;
  taskName: string;
  documents?: { name: string; url: string }[];
  folderId?: string;
}

interface OnboardingData {
  userid: string;
  country?: string;
  numberofbusinesses?: number;
  teamsize?: string;
  stage?: string;
  product?: string;
  strategy?: string;
  team?: string;
  finance?: string;
  growth?: string;
}

const BusinessDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'folders' | 'tasks'>('overview');
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core Data
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);

  // Action Modal States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Form States
  const [newProject, setNewProject] = useState({ projectName: '', projectDescription: '' });
  const [newFolderName, setNewFolderName] = useState('');
  const [newDoc, setNewDoc] = useState({ name: '', url: '' });
  const [newTask, setNewTask] = useState({ taskName: '', docName: '', docUrl: '' });

  // Fetch all business context
  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch businesses to find this business (there is no direct getBusinessById admin API)
      const businessesRes = await adminApi.getAllBusinesses();
      const businessesList: BusinessData[] = Array.isArray(businessesRes) 
        ? businessesRes 
        : (businessesRes?.businesses || businessesRes?.data || []);
      
      const foundBusiness = businessesList.find(b => b._id === id);
      if (!foundBusiness) {
        throw new Error('Business not found');
      }
      setBusiness(foundBusiness);

      // 2. Fetch onboarding records to find matched owner info
      try {
        const onboardingsRes = await adminApi.getAllOnboardings();
        const onboardingsList: OnboardingData[] = Array.isArray(onboardingsRes) 
          ? onboardingsRes 
          : (onboardingsRes?.onboardings || onboardingsRes?.data || []);
        const matchedOnboarding = onboardingsList.find(o => o.userid === foundBusiness.userid);
        if (matchedOnboarding) {
          setOnboarding(matchedOnboarding);
        }
      } catch (err) {
        console.error('Failed to load onboarding profiles:', err);
      }

      // 3. Fetch projects
      try {
        const projectsRes = await portfolioApi.getProjectsByBusinessId(id);
        setProjects(Array.isArray(projectsRes) ? projectsRes : (projectsRes?.data || []));
      } catch (err) {
        console.error('Failed to load projects:', err);
      }

      // 4. Fetch phases
      try {
        const phasesRes = await portfolioApi.getPhasesByBusinessId(id);
        setPhases(Array.isArray(phasesRes) ? phasesRes : (phasesRes?.data || []));
      } catch (err) {
        console.error('Failed to load phases:', err);
      }

      // 5. Fetch folders
      try {
        const foldersRes = await foldersApi.getAll();
        setFolders(Array.isArray(foldersRes) ? foldersRes : (foldersRes?.data || []));
      } catch (err) {
        console.error('Failed to load folders:', err);
      }

      // 6. Fetch business documents
      try {
        const docsRes = await businessDocumentsApi.getByBusinessId(id);
        setDocuments(Array.isArray(docsRes) ? docsRes : (docsRes?.data || []));
      } catch (err) {
        console.error('Failed to load documents:', err);
      }

      // 7. Fetch tasks
      try {
        const tasksRes = await businessItemsApi.getTasksByBusinessId(id);
        setTasks(Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data || []));
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading business context');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Actions
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newProject.projectName.trim()) return;
    try {
      await portfolioApi.createProject({
        businessId: id,
        projectName: newProject.projectName,
        projectDescription: newProject.projectDescription
      });
      setIsProjectModalOpen(false);
      setNewProject({ projectName: '', projectDescription: '' });
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create project');
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await foldersApi.create({ folderName: newFolderName });
      setIsFolderModalOpen(false);
      setNewFolderName('');
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create folder');
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newDoc.name.trim() || !newDoc.url.trim()) return;
    try {
      await businessDocumentsApi.create({
        businessId: id,
        name: newDoc.name,
        url: newDoc.url
      });
      setIsDocModalOpen(false);
      setNewDoc({ name: '', url: '' });
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create document');
    }
  };

  const handleAssignDocFolder = async (documentId: string, folderId: string) => {
    try {
      await businessDocumentsApi.appendFolder(documentId, folderId);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign document to folder');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newTask.taskName.trim()) return;
    try {
      const documentsList = [];
      if (newTask.docName.trim() && newTask.docUrl.trim()) {
        documentsList.push({ name: newTask.docName, url: newTask.docUrl });
      }

      await businessItemsApi.createTask({
        businessId: id,
        taskName: newTask.taskName,
        documents: documentsList
      });

      setIsTaskModalOpen(false);
      setNewTask({ taskName: '', docName: '', docUrl: '' });
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleAssignTaskFolder = async (taskId: string, folderId: string) => {
    try {
      await businessItemsApi.appendFolderToTask(taskId, folderId);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign task to folder');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f4f5f9] dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute w-full h-full rounded-full border-4 border-blue-150 animate-pulse"></div>
            <div className="absolute w-full h-full rounded-full border-4 border-t-blue-600 animate-spin"></div>
          </div>
          <span className="text-[13px] font-semibold text-gray-500">Loading Business Profile...</span>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="p-8 bg-[#f4f5f9] dark:bg-gray-900 min-h-screen">
        <button 
          onClick={() => navigate('/business')} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium text-[14px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Business</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'Business details not found'}</p>
          <button onClick={() => navigate('/business')} className="bg-[#002df3] text-white px-6 py-2.5 rounded-xl font-medium text-sm">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f4f5f9] dark:bg-gray-900 min-h-full">
      {/* Back link */}
      <button 
        onClick={() => navigate('/business')} 
        className="flex items-center gap-2 text-gray-650 dark:text-gray-450 hover:text-gray-950 dark:hover:text-white mb-6 font-semibold text-[13px]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </button>

      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm mb-6 border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 dark:text-white leading-tight mb-1">{business.businessName}</h1>
            <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-450 font-medium">
              <span>Owner User ID:</span>
              <span className="font-mono bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 text-[11px]">{business.userid}</span>
            </div>
          </div>
        </div>

        {/* Action button based on tab */}
        <div className="flex items-center gap-3">
          {activeTab === 'projects' && (
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          )}
          {activeTab === 'folders' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFolderModalOpen(true)}
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-750 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
              >
                <FolderPlus className="w-4 h-4" /> New Folder
              </button>
              <button 
                onClick={() => setIsDocModalOpen(true)}
                className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
              >
                <FilePlus className="w-4 h-4" /> Upload Document
              </button>
            </div>
          )}
          {activeTab === 'tasks' && (
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-2 bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 gap-6 mb-6">
        {[
          { id: 'overview', name: 'Overview & Onboarding', icon: Info },
          { id: 'projects', name: 'Projects & Phases', icon: Layers },
          { id: 'folders', name: 'Folders & Documents', icon: Folder },
          { id: 'tasks', name: 'Business Tasks', icon: CheckSquare }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-4 text-[14px] font-semibold transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-gray-500 dark:text-gray-450 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        {/* TAB 1: OVERVIEW & ONBOARDING */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Business Spec Cards */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Business Spec Profile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Product/Service</span>
                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">
                      {business.bizConcept?.product || business.product || 'Not Specified'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Target Customer</span>
                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">
                      {business.bizConcept?.customer || business.customer || 'Not Specified'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Company Culture</span>
                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">
                      {business.bizConcept?.culture || business.culture || 'Not Specified'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Go-To-Market Strategies</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {(business.bizConcept?.goToMarket || business.goToMarket || []).length > 0 ? (
                        (business.bizConcept?.goToMarket || business.goToMarket || []).map((strategy, idx) => (
                          <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-medium px-2 py-0.5 rounded-full capitalize">
                            {strategy.replace('_', ' ')}
                          </span>
                        ))
                      ) : (
                        <p className="text-[13px] text-gray-500">Not Specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Onboarding Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Owner Onboarding Data</h3>
              
              {onboarding ? (
                <div className="flex flex-col gap-5 text-[13.5px]">
                  <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-700/50 pb-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 block">Country</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{onboarding.country || 'USA'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-700/50 pb-3">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 block">Startup Stage</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{onboarding.stage || 'Not set'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-700/50 pb-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 block">Team Size</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{onboarding.teamsize || '1'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-700/50 pb-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 block">Financial Plan</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{onboarding.finance || 'Bootstrap'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 block">Growth Focus</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{onboarding.growth || 'High'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <User className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-[13px] text-gray-500">No onboarding profile has been submitted by this business owner.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS & PHASES */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between">
                    <div>
                      <h4 className="text-md font-bold text-gray-900 dark:text-white mb-2">{project.projectName}</h4>
                      <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">{project.projectDescription || 'No description provided.'}</p>
                    </div>

                    <div className="border-t border-gray-50 dark:border-gray-700/50 pt-4 mt-4">
                      <h5 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Project Phases</h5>
                      {phases.filter(p => p.projectId === project._id).length > 0 ? (
                        <ul className="flex flex-col gap-2">
                          {phases.filter(p => p.projectId === project._id).map((phase) => (
                            <li key={phase._id} className="flex items-center justify-between text-[13px] font-semibold text-gray-700 dark:text-gray-350">
                              <span className="flex items-center gap-2">
                                <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                                {phase.phaseName}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[12px] text-gray-400 italic">No phases registered for this project.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700/50">
                <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">No Projects Found</h4>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">You have not created any projects under this business profile.</p>
                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
                >
                  Create Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FOLDERS & DOCUMENTS */}
        {activeTab === 'folders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Folders List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Folders</h3>
              {folders.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {folders.map((folder) => (
                    <div key={folder._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-blue-50/50 transition-colors">
                      <Folder className="w-4.5 h-4.5 text-yellow-500" />
                      <span className="text-[13px] font-semibold text-gray-750 dark:text-gray-300">{folder.folderName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-450 italic py-4">No folders created yet.</p>
              )}
            </div>

            {/* Documents List */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Business Documents</h3>
              {documents.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {documents.map((doc) => (
                    <div key={doc._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl gap-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <span className="text-[13.5px] font-bold text-gray-850 dark:text-gray-200 block">{doc.name}</span>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                            {doc.url} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Folder select dropdown */}
                        <div className="relative">
                          <select 
                            value={doc.folderId || ''} 
                            onChange={(e) => handleAssignDocFolder(doc._id, e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-gray-650 focus:outline-none"
                          >
                            <option value="">Move to Folder...</option>
                            {folders.map(f => (
                              <option key={f._id} value={f._id}>{f.folderName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-[13px] text-gray-450 italic">No business documents uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TASKS */}
        {activeTab === 'tasks' && (
          <div className="flex flex-col gap-6">
            {tasks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {tasks.map((task) => (
                  <div key={task._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <h4 className="text-[14.5px] font-bold text-gray-900 dark:text-white mb-2">{task.taskName}</h4>
                      
                      {/* Attached Documents */}
                      {task.documents && task.documents.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {task.documents.map((doc, idx) => (
                            <a 
                              key={idx} 
                              href={doc.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-900 rounded-lg text-[11.5px] text-gray-650 hover:text-blue-500 border border-gray-150"
                            >
                              <FileText className="w-3.5 h-3.5 text-gray-450" />
                              <span>{doc.name}</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[12px] text-gray-400 italic">No files attached to this task.</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Folder mapping */}
                      <select 
                        value={task.folderId || ''}
                        onChange={(e) => handleAssignTaskFolder(task._id, e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-255 dark:border-gray-700 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-gray-650 focus:outline-none"
                      >
                        <option value="">Move to Folder...</option>
                        {folders.map(f => (
                          <option key={f._id} value={f._id}>{f.folderName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700/50">
                <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">No Business Tasks Found</h4>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">You have not registered any business items or compliance tasks under this business profile.</p>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="bg-[#002df3] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm"
                >
                  Create Task
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OVERLAY MODALS */}

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <form onSubmit={handleCreateProject} className="p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Create Project</h3>
              <input 
                type="text" 
                placeholder="Project Name" 
                required 
                value={newProject.projectName}
                onChange={e => setNewProject({ ...newProject, projectName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" 
              />
              <textarea 
                placeholder="Project Description" 
                value={newProject.projectDescription}
                onChange={e => setNewProject({ ...newProject, projectDescription: e.target.value })}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] resize-none h-24"
              />
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 border rounded-xl text-[13px] font-semibold text-gray-500">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#002df3] hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative">
            <form onSubmit={handleCreateFolder} className="p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Create Folder</h3>
              <input 
                type="text" 
                placeholder="Folder Name" 
                required 
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" 
              />
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="px-4 py-2 border rounded-xl text-[13px] font-semibold text-gray-500">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#002df3] hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <form onSubmit={handleCreateDocument} className="p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Document</h3>
              <input 
                type="text" 
                placeholder="Document Name" 
                required 
                value={newDoc.name}
                onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" 
              />
              <input 
                type="url" 
                placeholder="Document URL (e.g. https://...)" 
                required 
                value={newDoc.url}
                onChange={e => setNewDoc({ ...newDoc, url: e.target.value })}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" 
              />
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="px-4 py-2 border rounded-xl text-[13px] font-semibold text-gray-500">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#002df3] hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <form onSubmit={handleCreateTask} className="p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Create Business Task</h3>
              
              <div className="flex flex-col gap-3">
                <label className="text-[12px] font-bold text-gray-400">Task details</label>
                <input 
                  type="text" 
                  placeholder="Task Name" 
                  required 
                  value={newTask.taskName}
                  onChange={e => setNewTask({ ...newTask, taskName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" 
                />
              </div>

              <div className="flex flex-col gap-3 mt-2 border-t border-gray-100 pt-3">
                <label className="text-[12px] font-bold text-gray-400">Attach Document (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Attached Doc Name" 
                  value={newTask.docName}
                  onChange={e => setNewTask({ ...newTask, docName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" 
                />
                <input 
                  type="url" 
                  placeholder="Attached Doc URL" 
                  value={newTask.docUrl}
                  onChange={e => setNewTask({ ...newTask, docUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" 
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 border rounded-xl text-[13px] font-semibold text-gray-500">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#002df3] hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BusinessDetails;
