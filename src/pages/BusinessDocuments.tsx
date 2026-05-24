import { useState, useEffect } from 'react';
import { Search, Plus, X, FileText } from 'lucide-react';
import { businessDocumentsApi } from '../services/api';
import { toast } from '../components/Toast';

const BusinessDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    businessId: '',
    title: '',
    description: '',
    type: ''
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await businessDocumentsApi.getByBusinessId('');
      const list = Array.isArray(data) ? data : (data.documents || data.data || []);
      setDocuments(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter a document title');
      return;
    }

    try {
      setCreating(true);
      await businessDocumentsApi.create(formData);
      toast.success('Document created successfully');
      setShowCreateModal(false);
      setFormData({ businessId: '', title: '', description: '', type: '' });
      await fetchDocuments();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create document');
    } finally {
      setCreating(false);
    }
  };

  const filteredDocuments = documents.filter((d: any) => {
    const title = (d.title || '').toLowerCase();
    const type = (d.type || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || type.includes(query);
  });

  return (
    <div className="p-8 bg-white min-h-full">
      <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Business Documents</h1>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] w-80"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Document
        </button>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Document List</h3>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-5 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[700px]">
              <div>Title</div>
              <div>Business ID</div>
              <div>Type</div>
              <div>Description</div>
              <div>Created</div>
            </div>

            <div className="flex flex-col min-w-[700px]">
              {filteredDocuments.map((d: any, index: number) => (
                <div
                  key={d._id || d.id || index}
                  className="grid grid-cols-5 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    {d.title || 'N/A'}
                  </div>
                  <div className="font-mono text-[11px] text-blue-600">{d.businessId || 'N/A'}</div>
                  <div>{d.type || 'N/A'}</div>
                  <div className="truncate">{d.description || 'N/A'}</div>
                  <div className="text-[11px] text-gray-500">
                    {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No documents found.</p>
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create New Document</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business ID</label>
                <input
                  type="text"
                  value={formData.businessId}
                  onChange={(e) => setFormData({...formData, businessId: e.target.value})}
                  placeholder="Enter business ID"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter document title"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  placeholder="e.g., Invoice, Contract"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Document description"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {creating ? 'Creating...' : 'Create Document'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDocuments;
