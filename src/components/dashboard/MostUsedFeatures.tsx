interface MostUsedFeaturesProps {
  stats: any;
  loading: boolean;
}

const MostUsedFeatures = ({ stats, loading }: MostUsedFeaturesProps) => {
  const features = stats?.features
    ? [
        { name: 'Skills', value: String(stats.features.skills) },
        { name: 'Projects', value: String(stats.features.projects) },
        { name: 'Documents', value: String(stats.features.documents) },
        { name: 'Tasks', value: String(stats.features.tasks) },
        { name: 'Integrations', value: String(stats.features.integrations) },
      ].sort((a, b) => Number(b.value) - Number(a.value))
    : [
        { name: 'Block', value: '50%' },
        { name: 'Process', value: '30%' },
        { name: 'Projects', value: '25%' },
        { name: 'Block', value: '10%' },
      ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm col-span-1 md:col-span-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Used Features</h3>
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="text-sm text-gray-400 animate-pulse text-center py-4">Loading features stats...</div>
        ) : (
          features.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-[13px]">
              <span className="text-gray-700">{item.name}</span>
              <span className={`px-3 py-1 rounded-full font-medium ${i === 0 ? 'bg-[#002df3] text-white' : 'bg-[#e0e8ff] text-gray-700'}`}>
                {item.value}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MostUsedFeatures;
