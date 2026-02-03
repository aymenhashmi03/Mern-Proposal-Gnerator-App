import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Settings,
  LogOut,
  Calendar,
  DollarSign,
  User,
  Edit,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    projectDescription: '',
    budget: '',
    deadline: '',
    status: 'Draft',
  });

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await axios.get(`${API_URL}/proposals`);
      setProposals(response.data.proposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/proposals`, formData);
      setShowCreateModal(false);
      resetForm();
      fetchProposals();
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  const handleUpdateProposal = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/proposals/${currentProposal._id}`, formData);
      setShowEditModal(false);
      resetForm();
      fetchProposals();
    } catch (error) {
      console.error('Error updating proposal:', error);
    }
  };

  const handleDeleteProposal = async (id) => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      try {
        await axios.delete(`${API_URL}/proposals/${id}`);
        fetchProposals();
      } catch (error) {
        console.error('Error deleting proposal:', error);
      }
    }
  };

  const openEditModal = (proposal) => {
    setCurrentProposal(proposal);
    setFormData({
      title: proposal.title,
      clientName: proposal.clientName,
      projectDescription: proposal.projectDescription,
      budget: proposal.budget,
      deadline: new Date(proposal.deadline).toISOString().split('T')[0],
      status: proposal.status,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      clientName: '',
      projectDescription: '',
      budget: '',
      deadline: '',
      status: 'Draft',
    });
    setCurrentProposal(null);
  };

  const filteredProposals = proposals.filter(
    (proposal) =>
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Sent: 'bg-blue-100 text-blue-700',
      'In Review': 'bg-yellow-100 text-yellow-700',
      Accepted: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Proposal Generator</h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Proposals</h2>
          <p className="text-gray-600">Manage and track all your client proposals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Proposals</p>
                <p className="text-2xl font-bold text-gray-900">{proposals.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="text-primary-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {proposals.filter((p) => p.status === 'Accepted').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {proposals.filter((p) => p.status === 'In Review').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Draft</p>
                <p className="text-2xl font-bold text-gray-600">
                  {proposals.filter((p) => p.status === 'Draft').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="text-gray-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Create New Proposal
          </button>
        </div>

        {/* Proposals List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'No proposals match your search' : 'Get started by creating your first proposal'}
            </p>
            {!searchQuery && (
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                Create Your First Proposal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProposals.map((proposal) => (
              <motion.div
                key={proposal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>{proposal.clientName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>Deadline: {new Date(proposal.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign size={16} />
                        <span>Budget: ${proposal.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(proposal)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProposal(proposal._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {showEditModal ? 'Edit Proposal' : 'Create New Proposal'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={showEditModal ? handleUpdateProposal : handleCreateProposal} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proposal Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="E.g., Website Redesign Project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="input-field"
                    placeholder="E.g., Acme Corporation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Describe the project scope, deliverables, and objectives..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="input-field"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline *</label>
                    <input
                      type="date"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="In Review">In Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    {showEditModal ? 'Update Proposal' : 'Create Proposal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

