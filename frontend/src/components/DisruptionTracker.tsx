import { useState } from 'react';

// Mock data for demonstration
const mockDisruptions = [
  {
    id: 'DIS-001',
    category: 'infrastructure',
    priority: 'high',
    description: 'Water leak in the main hallway near the library entrance',
    status: 'pending',
    createdAt: '2023-05-15T10:30:00Z',
    aiTone: 'urgent',
  },
  {
    id: 'DIS-002',
    category: 'it',
    priority: 'low',
    description: 'WiFi connectivity issues in classroom B204',
    status: 'in_progress',
    createdAt: '2023-05-16T14:15:00Z',
    aiTone: 'neutral',
  },
  {
    id: 'DIS-003',
    category: 'library',
    priority: 'high',
    description: 'Broken study room door lock in Library Room 3',
    status: 'resolved',
    createdAt: '2023-05-10T09:45:00Z',
    resolvedAt: '2023-05-12T16:20:00Z',
    aiTone: 'polite',
  },
];

const DisruptionTracker = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'infrastructure': return 'Infrastructure';
      case 'it': return 'IT Department';
      case 'library': return 'Library';
      case 'classroom': return 'Classroom/Staff-room';
      default: return category;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High Priority</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Low Priority</span>;
  };

  const filteredDisruptions = mockDisruptions.filter(disruption => {
    const statusMatch = filterStatus === 'all' || disruption.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || disruption.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Track Your Disruptions</h2>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="status-filter"
            className="input-field w-full"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            id="category-filter"
            className="input-field w-full"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="it">IT Department</option>
            <option value="library">Library</option>
            <option value="classroom">Classroom/Staff-room</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            className="btn-secondary w-full"
            onClick={() => {
              setFilterStatus('all');
              setFilterCategory('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Disruption List */}
      <div className="space-y-4">
        {filteredDisruptions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No disruptions found matching your filters.</p>
          </div>
        ) : (
          filteredDisruptions.map((disruption) => (
            <div key={disruption.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{disruption.id}</h3>
                    <div className="ml-3 flex space-x-2">
                      {getStatusBadge(disruption.status)}
                      {getPriorityBadge(disruption.priority)}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoryName(disruption.category)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {disruption.aiTone.charAt(0).toUpperCase() + disruption.aiTone.slice(1)} Tone
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{disruption.description}</p>
                </div>
                <div className="mt-2 md:mt-0 text-sm text-gray-500">
                  <p>Reported: {new Date(disruption.createdAt).toLocaleDateString()}</p>
                  {disruption.resolvedAt && (
                    <p>Resolved: {new Date(disruption.resolvedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisruptionTracker;