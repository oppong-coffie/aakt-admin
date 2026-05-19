import Head from '../components/dashboard/Head';
import TopStats from '../components/dashboard/TopStats';
import GrowthChart from '../components/dashboard/GrowthChart';
import ActiveIndustries from '../components/dashboard/ActiveIndustries';
import MostUsedFeatures from '../components/dashboard/MostUsedFeatures';

const Dashboard = () => {
  return (
    <div className="p-8 bg-[#f4f5f9] min-h-full">
      <Head />
      <TopStats />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GrowthChart />
        <ActiveIndustries />
      </div>
      <MostUsedFeatures />
    </div>
  )
}

export default Dashboard;