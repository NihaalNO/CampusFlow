import { useState } from 'react';

const DisruptionForm = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const categories = [
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'it', name: 'IT Department' },
    { id: 'library', name: 'Library' },
    { id: 'classroom', name: 'Classroom/Staff-room' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + images.length > 3) {
        alert('You can only upload a maximum of 3 images');
        return;
      }
      
      setImages(prev => [...prev, ...files]);
      
      // Create previews
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) {
      alert('Please select a category');
      return;
    }
    
    if (description.length < 20 || description.length > 1000) {
      alert('Description must be between 20 and 1000 characters');
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log({
      category,
      description,
      images,
    });
    
    alert('Disruption reported successfully!');
    
    // Reset form
    setCategory('');
    setDescription('');
    setImages([]);
    setImagePreviews([]);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Report a Disruption</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  category === cat.id
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setCategory(cat.id)}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border mr-3 ${
                    category === cat.id ? 'bg-primary border-primary' : 'border-gray-400'
                  }`}>
                    {category === cat.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium">{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Priority Badge */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Auto-assigned: {category === 'infrastructure' || category === 'it' ? 'High Priority' : 'Low Priority'}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            className="input-field w-full"
            placeholder="Describe the disruption in detail (20-1000 characters)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">
              {description.length}/1000 characters
            </span>
            {description.length > 0 && description.length < 20 && (
              <span className="text-sm text-red-500">
                Minimum 20 characters required
              </span>
            )}
          </div>
        </div>
        
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Upload images</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, HEIC up to 5MB each (max 3 files)
              </p>
            </div>
          </div>
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    onClick={() => removeImage(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
          >
            Submit Disruption Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default DisruptionForm;