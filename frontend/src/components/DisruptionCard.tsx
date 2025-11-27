import { useState } from 'react';

type Disruption = {
  id: string;
  studentName: string;
  studentId: string;
  category: string;
  priority: 'high' | 'low';
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  aiTone: string;
  aiConfidence: number;
  aiRecommendation: string;
  imageUrls: string[];
};

const DisruptionCard = ({ disruption }: { disruption: Disruption }) => {
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionImage, setResolutionImage] = useState<File | null>(null);
  const [resolutionDescription, setResolutionDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High Priority</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Low Priority</span>;
  };

  const getToneBadge = (tone: string, confidence: number) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    
    switch (tone.toLowerCase()) {
      case 'urgent':
      case 'frustrated':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'neutral':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'polite':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'angry':
      case 'aggressive':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        break;
      case 'confused':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone
        <span className="ml-1 text-xs opacity-75">({Math.round(confidence * 100)}%)</span>
      </span>
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResolutionImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resolutionImage) {
      alert('Please upload a resolution image');
      return;
    }
    
    if (resolutionDescription.length < 20) {
      alert('Resolution description must be at least 20 characters');
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log({
      disruptionId: disruption.id,
      resolutionImage,
      resolutionDescription,
    });
    
    alert('Disruption resolved successfully!');
    setShowResolveModal(false);
    
    // Reset form
    setResolutionImage(null);
    setResolutionDescription('');
    setImagePreview(null);
  };

  return (
    <>
      <div className="card border-l-4 border-primary">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg font-medium text-gray-900">{disruption.id}</h3>
              {getStatusBadge(disruption.status)}
              {getPriorityBadge(disruption.priority)}
              {getToneBadge(disruption.aiTone, disruption.aiConfidence)}
            </div>
            
            <div className="mb-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Student:</span> {disruption.studentName} ({disruption.studentId})
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Reported:</span> {new Date(disruption.createdAt).toLocaleString()}
              </p>
            </div>
            
            <p className="text-gray-700 mb-3">{disruption.description}</p>
            
            {disruption.aiRecommendation && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">AI Recommendation:</span> {disruption.aiRecommendation}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4 md:mt-0">
            {disruption.status !== 'resolved' ? (
              <button
                onClick={() => setShowResolveModal(true)}
                className="btn-primary"
              >
                Mark as Resolved
              </button>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Resolved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Resolve Disruption</h3>
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleResolve}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Image <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Resolution preview"
                            className="mx-auto h-32"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={() => {
                              setResolutionImage(null);
                              setImagePreview(null);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="resolution-image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                            >
                              <span>Upload image</span>
                              <input
                                id="resolution-image-upload"
                                name="resolution-image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="resolution-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="resolution-description"
                    rows={4}
                    className="input-field w-full"
                    placeholder="Describe the actions taken to resolve this disruption (minimum 20 characters)"
                    value={resolutionDescription}
                    onChange={(e) => setResolutionDescription(e.target.value)}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">
                      {resolutionDescription.length}/1000 characters
                    </span>
                    {resolutionDescription.length > 0 && resolutionDescription.length < 20 && (
                      <span className="text-sm text-red-500">
                        Minimum 20 characters required
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowResolveModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Submit Resolution
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisruptionCard;