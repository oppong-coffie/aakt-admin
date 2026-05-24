import { useState, useEffect } from 'react';
import { Search, Plus, X, Briefcase, FolderOpen, CheckSquare, FileText } from 'lucide-react';
import { portfolioApi, foldersApi, businessItemsApi, businessDocumentsApi } from '../services/api';
import { toast } from '../components/Toast';

const Business = () => {
  const [activeTab, setActiveTab] = useState<'businesses' | 'portfolio' | 'folders' | 'items' | 'documents'>('businesses');
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Businesses
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [businessForm, setBusinessForm] = useState({ name: '', description: '', industry: '' });

  // Portfolio
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({ name: '', businessId: '' });

  // Folders
  const [folders, setFolders] = useState<any[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderForm, setFolderForm] = useState({ name: '', description: '' });

  // Items
  const [items, setItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState({ title: '', businessId: '', status: 'pending' });

  // Documents
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentForm, setDocumentForm] = useState({ title: '', businessId: '', type: '' });

  const tabs = [
    { id: 'businesses' as const, label: 'Businesses', icon: Briefcase },
    { id: 'portfolio' as const, label: 'Portfolio', icon: Briefcase },
    { id: 'folders' as const, label: 'Folders', icon: FolderOpen },
    { id: 'items' as const, label: 'Business Items', icon: CheckSquare },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
  ];

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'businesses') fetchBusinesses();
    else if (activeTab === 'portfolio') fetchPortfolio();
    else if (activeTab === 'folders') fetchFolders();
    else if (activeTab === 'items') fetchItems();
    else if (activeTab === 'documents') fetchDocuments();
  }, [activeTab]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await portfolioApi.getAllBusinesses();
      const list = Array.isArray(data) ? data : (data.businesses || data.data || []);
      setBusinesses(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolio = async () => {
    try {
      setPortfolioLoading(true);
      const data = await portfolioApi.getProjectsByBusinessId('');
      const list = Array.isArray(data) ? data : (data.projects || data.data || []);
      setPortfolio(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch portfolio');
    } finally {
      setPortfolioLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      setFoldersLoading(true);
      const data = await foldersApi.getAll();
      const list = Array.isArray(data) ? data : (data.folders || data.data || []);
      setFolders(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch folders');
    } finally {
      setFoldersLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setItemsLoading(true);
      const data = await businessItemsApi.getTasksByBusinessId('');
      const list = Array.isArray(data) ? data : (data.tasks || data.data || []);
      setItems(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch items');
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const data = await businessDocumentsApi.getByBusinessId('');
      const list = Array.isArray(data) ? data : (data.documents || data.data || []);
      setDocuments(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch documents');
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Create handlers
  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessForm.name) return toast.error('Please enter a name');
    try {
      setCreating(true);
      await portfolioApi.createBusiness(businessForm);
      toast.success('Business created');
      setShowBusinessModal(false);
      setBusinessForm({ name: '', description: '', industry: '' });
      fetchBusinesses();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create');
    } finally {
      setCreating(false);
    }
  };

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.name) return toast.error('Please enter a name');
    try {
      await portfolioApi.createProject(portfolioForm);
      toast.success('Project created');
      setShowPortfolioModal(false);
      setPortfolioForm({ name: '', businessId: '' });
      fetchPortfolio();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create');
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderForm.name) return toast.error('Please enter a name');
    try {
      await foldersApi.create(folderForm);
      toast.success('Folder created');
      setShowFolderModal(false);
      setFolderForm({ name: '', description: '' });
      fetchFolders();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create');
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.title) return toast.error('Please enter a title');
    try {
      await businessItemsApi.createTask(itemForm);
      toast.success('Task created');
      setShowItemModal(false);
      setItemForm({ title: '', businessId: '', status: 'pending' });
      fetchItems();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create');
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentForm.title) return toast.error('Please enter a title');
    try {
      await businessDocumentsApi.create(documentForm);
      toast.success('Document created');
      setShowDocumentModal(false);
      setDocumentForm({ title: '', businessId: '', type: '' });
      fetchDocuments();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create');
    }
  };

  const renderTable = () => {
    if (activeTab === 'businesses') {
      return loading ? 'loading' : businesses.length === 0 ? 'empty' : 'businesses';
    } else if (activeTab === 'portfolio') {
      return portfolioLoading ? 'loading' : portfolio.length === 0 ? 'empty' : 'portfolio';
    } else if (activeTab === 'folders') {
      return foldersLoading ? 'loading' : folders.length === 0 ? 'empty' : 'folders';
    } else if (activeTab === 'items') {
      return itemsLoading ? 'loading' : items.length === 0 ? 'empty' : 'items';
    } else {
      return documentsLoading ? 'loading' : documents.length === 0 ? 'empty' : 'documents';
    }
  };

  const tableState = renderTable();

  return (
    <div className="p-8 bg-white min-h-full">
      <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Business Management</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder={`search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] w-80"
          />
        </div>
        <button
          onClick={() => {
            if (activeTab === 'businesses') setShowBusinessModal(true);
            else if (activeTab === 'portfolio') setShowPortfolioModal(true);
            else if (activeTab === 'folders') setShowFolderModal(true);
            else if (activeTab === 'items') setShowItemModal(true);
            else setShowDocumentModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        {tableState === 'loading' && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        )}

        {tableState === 'empty' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500">No {activeTab} found.</p>
          </div>
        )}

        {tableState !== 'loading' && tableState !== 'empty' && (
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200">
              <div>Name</div>
              <div>{activeTab === 'businesses' ? 'Industry' : activeTab === 'folders' ? 'Description' : 'Type'}</div>
              <div>Description</div>
              <div>Created</div>
            </div>

            <div className="flex flex-col">
              {(activeTab === 'businesses' ? businesses :
                activeTab === 'portfolio' ? portfolio :
                activeTab === 'folders' ? folders :
                activeTab === 'items' ? items : documents
              ).map((item: any, index: number) => (
                <div
                  key={item._id || item.id || index}
                  className="grid grid-cols-4 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">{item.name || item.title || 'N/A'}</div>
                  <div>{item.industry || item.type || 'N/A'}</div>
                  <div className="truncate">{item.description || 'N/A'}</div>
                  <div className="text-[11px] text-gray-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Business</h2>
              <button onClick={() => setShowBusinessModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <input type="text" placeholder="Name" value={businessForm.name} onChange={e => setBusinessForm({...businessForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Industry" value={businessForm.industry} onChange={e => setBusinessForm({...businessForm, industry: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <textarea placeholder="Description" value={businessForm.description} onChange={e => setBusinessForm({...businessForm, description: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" rows={3} />
              <button type="submit" disabled={creating} className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg">{creating ? 'Creating...' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}

      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Project</h2>
              <button onClick={() => setShowPortfolioModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreatePortfolio} className="space-y-4">
              <input type="text" placeholder="Project Name" value={portfolioForm.name} onChange={e => setPortfolioForm({...portfolioForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Business ID" value={portfolioForm.businessId} onChange={e => setPortfolioForm({...portfolioForm, businessId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <button type="submit" className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg">Create</button>
            </form>
          </div>
        </div>
      )}

      {showFolderModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Folder</h2>
              <button onClick={() => setShowFolderModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input type="text" placeholder="Folder Name" value={folderForm.name} onChange={e => setFolderForm({...folderForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
              <textarea placeholder="Description" value={folderForm.description} onChange={e => setFolderForm({...folderForm, description: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" rows={3} />
              <button type="submit" className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg">Create</button>
            </form>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Task</h2>
              <button onClick={() => setShowItemModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <input type="text" placeholder="Task Title" value={itemForm.title} onChange={e => setItemForm({...itemForm, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Business ID" value={itemForm.businessId} onChange={e => setItemForm({...itemForm, businessId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <button type="submit" className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg">Create</button>
            </form>
          </div>
        </div>
      )}

      {showDocumentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Document</h2>
              <button onClick={() => setShowDocumentModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateDocument} className="space-y-4">
              <input type="text" placeholder="Document Title" value={documentForm.title} onChange={e => setDocumentForm({...documentForm, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Business ID" value={documentForm.businessId} onChange={e => setDocumentForm({...documentForm, businessId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Type" value={documentForm.type} onChange={e => setDocumentForm({...documentForm, type: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
              <button type="submit" className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Business;
