import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { apiService } from '../lib/api';
import toast from 'react-hot-toast';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    researchField: '',
    storyType: '',
    privacy: 'public'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const postData = {
        title: formData.title,
        content: formData.description,
        category: formData.researchField,
        tags: [formData.storyType].filter(Boolean),
        failureDetails: {
          whatWentWrong: formData.description,
          lessonsLearned: 'To be added',
          nextSteps: 'To be determined',
          impact: 'Medium',
          timeLost: 'Days'
        },
        collaboration: {
          isRequestingHelp: false,
          helpDescription: ''
        },
        privacy: {
          visibility: formData.privacy === 'public' ? 'Public' : 'Private',
          allowComments: true,
          allowSharing: true
        },
        isAnonymous: false
      };

      console.log('Creating post with data:', postData);
      
      const response = await apiService.createPost(postData);
      console.log('Post created successfully:', response);
      
      toast.success('Post created successfully!');
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        researchField: '',
        storyType: '',
        privacy: 'public'
      });
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New Post</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Failed Attempt at CRISPR Delivery Method"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Share your research experience, methodology, challenges, and lessons learned..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Tags
            </label>
            <div className="grid grid-cols-2 gap-4">
              <select 
                name="researchField"
                value={formData.researchField}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Research Field</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Medicine">Medicine</option>
                <option value="Engineering">Engineering</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Environmental Science">Environmental Science</option>
              </select>
              <select 
                name="storyType"
                value={formData.storyType}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Type of Story</option>
                <option value="Failure">Failure</option>
                <option value="Success">Success</option>
                <option value="Breakthrough">Breakthrough</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy Settings
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="privacy" 
                  value="public" 
                  checked={formData.privacy === 'public'}
                  onChange={handleChange}
                  className="text-blue-500" 
                />
                <span className="text-sm text-gray-700">Public - Visible to everyone</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="privacy" 
                  value="private" 
                  checked={formData.privacy === 'private'}
                  onChange={handleChange}
                  className="text-blue-500" 
                />
                <span className="text-sm text-gray-700">Private - Only you can see</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="privacy" 
                  value="semi-public" 
                  checked={formData.privacy === 'semi-public'}
                  onChange={handleChange}
                  className="text-blue-500" 
                />
                <span className="text-sm text-gray-700">Semi-Public - Visible to researchers in your field</span>
              </label>
            </div>
          </div>
          
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" className="hidden" id="file-upload" multiple />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-600">
                  <p>Drag and drop files here, or click to select</p>
                  <p className="text-sm text-gray-500">PDF, Images, Data files (max 10MB each)</p>
                </div>
              </label>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Publish Your Experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal; 