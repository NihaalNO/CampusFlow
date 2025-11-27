import { useState } from 'react';
import DisruptionCard from '../components/DisruptionCard';

// Mock data for demonstration
const mockDisruptions = [
  {
    id: 'DIS-001',
    studentName: 'John Doe',
    studentId: 'S123456',
    category: 'infrastructure',
    priority: 'high',
    description: 'Water leak in the main hallway near the library entrance',
    status: 'pending',
    createdAt: '2023-05-15T10:30:00Z',
    aiTone: 'urgent',
    aiConfidence: 0.95,
    aiRecommendation: 'This disruption appears to be urgent. Consider prioritizing for quick response.',
    imageUrls: [],
  },
  {
    id: 'DIS-002',
    studentName: 'Jane Smith',
    studentId: 'S789012',
    category: 'infrastructure',
    priority: 'high',
    description: 'Broken elevator in Building A',
    status: 'pending',
    createdAt: '2023-05-16T14:15:00Z',
    aiTone: 'frustrated',
    aiConfidence: 0.87,
    aiRecommendation: 'This disruption appears to be frustrated. Consider prioritizing for quick response.',
    imageUrls: [],
  },
  {
    id: 'DIS-003',
    studentName: 'Robert Johnson',
    studentId: 'S345678',
    category: 'it',
    priority: 'low',
    description: 'WiFi connectivity issues in classroom B204',
    status: 'in_progress',
    createdAt: '2023-05-16T14:15:00Z',
    aiTone: 'neutral',
    aiConfidence: 0.92,
    aiRecommendation: 'This disruption appears to be neutral. Standard handling procedure applies.',
    imageUrls: [],
  },
];

const AdminDashboard = ({ department }: { department: string }) => {
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter disruptions by department
  const departmentDisruptions = mockDisruptions.filter(
    disruption => disruption.category === department
  );

  // Apply additional filters
  const filteredDisruptions = departmentDisruptions.filter(disruption => {
    const priorityMatch = filterPriority === 'all' || disruption.priority === filterPriority;
    const statusMatch = filterStatus === 'all' || disruption.status === filterStatus;
    const searchMatch = 
      disruption.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disruption.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disruption.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return priorityMatch && statusMatch && searchMatch;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {department.charAt(0).toUpperCase() + department.slice(1)} Department Dashboard
        </h2>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-gray-600">Total Disruptions</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-yellow-500">2</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-blue-500">1</div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-green-500">0</div>
            <div className="text-gray-600">Resolved Today</div>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Priority
            </label>
            <select
              id="priority-filter"
              className="input-field w-full"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
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
          
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              className="input-field w-full"
              placeholder="Search by ID, description, or student name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Disruption List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {filteredDisruptions.length} Disruption{filteredDisruptions.length !== 1 ? 's' : ''} Found
        </h3>
        
        {filteredDisruptions.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No disruptions found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDisruptions.map((disruption) => (
              <DisruptionCard key={disruption.id} disruption={disruption} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;