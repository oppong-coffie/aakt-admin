import { useState, useEffect } from 'react';
import { Search, FolderOpen } from 'lucide-react';
import { adminApi } from '../services/api';
import { toast } from '../components/Toast';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllProjects();
      const list = Array.isArray(res) ? res : (res?.projects || res?.data || []);
      setProjects(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p: any) => {
    const name = (p.projectName || '').toLowerCase();
    const description = (p.projectDescription || '').toLowerCase();
    const businessId = (p.businessId || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || description.includes(query) || businessId.includes(query);
  });

  return (
    <div className="p-8 bg-white min-h-full">
      <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Projects</h1>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] w-80"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Projects List</h3>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[600px]">
              <div>Project Name</div>
              <div>Description</div>
              <div>Business ID</div>
              <div>Created</div>
            </div>

            <div className="flex flex-col min-w-[600px]">
              {filteredProjects.map((p: any, index: number) => (
                <div
                  key={p._id || p.id || index}
                  className="grid grid-cols-4 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{p.projectName || 'N/A'}</div>
                  <div className="truncate">{p.projectDescription || 'N/A'}</div>
                  <div>{p.businessId || 'N/A'}</div>
                  <div className="text-[11px] text-gray-500">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
