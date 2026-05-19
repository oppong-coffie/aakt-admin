const ActiveIndustries = () => {
  const industries = [
    { name: 'Tech Nu', value: '50%' },
    { name: 'Origgin', value: '30%' },
    { name: 'Origgin', value: '30%' },
    { name: 'Noon', value: '25%' },
    { name: 'Tabalat', value: '10%' },
    { name: 'Tabalat', value: '10%' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Industries</h3>
      <div className="flex flex-col gap-6">
        {industries.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[13px]">
            <span className="text-gray-700">{item.name}</span>
            <span className={`px-3 py-1 rounded-full font-medium ${item.value === '50%' ? 'bg-[#002df3] text-white' : 'bg-[#e0e8ff] text-gray-700'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveIndustries;
