import { useEffect, useMemo, useState } from 'react';
import { Search, User } from 'lucide-react';
import { adminApi } from '../services/api';

type OnboardingItem = {
  _id?: string;
  id?: string;
  userid?: string;
  country?: string;
  stage?: string;
  teamsize?: string | number;
  numberofbusinesses?: string | number;
  createdAt?: string;
};

type OnboardingsResponse = {
  onboardings?: OnboardingItem[];
  data?: OnboardingItem[];
};

const toText = (value: unknown) => (value == null ? '' : String(value));

const getOnboardingList = (response: unknown): OnboardingItem[] => {
  if (Array.isArray(response)) {
    return response as OnboardingItem[];
  }

  if (response && typeof response === 'object') {
    const payload = response as OnboardingsResponse;
    return payload.onboardings || payload.data || [];
  }

  return [];
};

const Onboardings = () => {
  const [onboardings, setOnboardings] = useState<OnboardingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOnboardings = async () => {
    try {
      const response: unknown = await adminApi.getAllOnboardings();
      setError('');
      setOnboardings(getOnboardingList(response));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch onboardings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchOnboardings();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredOnboardings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return onboardings;

    return onboardings.filter((onboarding) => {
      const userId = toText(onboarding.userid).toLowerCase();
      const country = toText(onboarding.country).toLowerCase();
      const stage = toText(onboarding.stage).toLowerCase();
      return userId.includes(query) || country.includes(query) || stage.includes(query);
    });
  }, [onboardings, searchQuery]);

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Onboardings</h1>

        <div className="flex items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="search by user ID, country, or stage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[320px] shadow-sm text-[14px] text-gray-800"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Onboarding Profiles</h3>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
        ) : filteredOnboardings.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-6 gap-4 pb-4 text-[13px] font-semibold text-gray-900 border-b border-gray-200 min-w-[760px]">
              <div>User ID</div>
              <div>Country</div>
              <div>Stage</div>
              <div>Team Size</div>
              <div>Businesses</div>
              <div>Created</div>
            </div>

            <div className="flex flex-col min-w-[760px]">
              {filteredOnboardings.map((onboarding, index) => (
                <div
                  key={onboarding._id || onboarding.id || onboarding.userid || index}
                  className="grid grid-cols-6 gap-4 py-4 text-[13px] text-gray-600 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="font-mono text-[11px] text-blue-600">{onboarding.userid || 'N/A'}</div>
                  <div>{onboarding.country || 'N/A'}</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 capitalize">
                      {onboarding.stage || 'Not set'}
                    </span>
                  </div>
                  <div>{onboarding.teamsize || '1'}</div>
                  <div>{onboarding.numberofbusinesses || 0}</div>
                  <div className="text-[11px] text-gray-500">
                    {onboarding.createdAt ? new Date(onboarding.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <User className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500">
              {error ? 'Failed to load onboardings. Check console for details.' : 'No onboardings found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboardings;
