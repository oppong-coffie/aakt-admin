import { useState, useEffect } from 'react';
import Head from '../components/dashboard/Head';
import TopStats from '../components/dashboard/TopStats';
import GrowthChart from '../components/dashboard/GrowthChart';
import ActiveIndustries from '../components/dashboard/ActiveIndustries';
import MostUsedFeatures from '../components/dashboard/MostUsedFeatures';
import { adminApi } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getDashboardStats();
        if (res && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="p-8 bg-[#f4f5f9] min-h-full">
      <Head />
      <TopStats stats={stats} loading={loading} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GrowthChart stats={stats} loading={loading} />
        <ActiveIndustries stats={stats} loading={loading} />
      </div>
      <MostUsedFeatures stats={stats} loading={loading} />
    </div>
  );
};

export default Dashboard;