'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Select } from '@/components/ui/Select';
import { 
  genealogyApi,
  managersApi,
  GenealogyNode 
} from '@/lib/api';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  X,
  Save
} from 'lucide-react';

export default function AdminGenealogyPage() {
  const [genealogyNodes, setGenealogyNodes] = useState<GenealogyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    managerId: '',
    parentManagerId: '',
    level: 'A' as 'A' | 'B' | 'C',
    commissionRate: 10,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const levels = [
    { value: 'A', label: 'Level A (10%)' },
    { value: 'B', label: 'Level B (7.5%)' },
    { value: 'C', label: 'Level C (5%)' },
  ];

  const commissionRates = {
    A: 10,
    B: 7.5,
    C: 5,
  };

  useEffect(() => {
    loadGenealogyNodes();
  }, []);

  useEffect(() => {
    // Auto-set commission rate based on level
    setFormData(prev => ({
      ...prev,
      commissionRate: commissionRates[prev.level],
    }));
  }, [formData.level]);

  const loadGenealogyNodes = async () => {
    try {
      const response = await genealogyApi.getAll();
      setGenealogyNodes(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load genealogy data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingNode) {
        await genealogyApi.update(editingNode, formData);
        setSuccess('Genealogy assignment updated successfully');
      } else {
        await genealogyApi.create(formData);
        setSuccess('Genealogy assignment created successfully');
      }
      
      resetForm();
      loadGenealogyNodes();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (node: GenealogyNode) => {
    setFormData({
      managerId: node.manager.id,
      parentManagerId: node.parentManager.id,
      level: node.level,
      commissionRate: node.commissionRate,
    });
    setEditingNode(node.id);
    setShowAddForm(true);
  };

  const handleDelete = async (nodeId: string) => {
    if (!confirm('Are you sure you want to delete this genealogy assignment?')) {
      return;
    }

    try {
      await genealogyApi.delete(nodeId);
      setSuccess('Genealogy assignment deleted successfully');
      loadGenealogyNodes();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete assignment');
    }
  };

  const resetForm = () => {
    setFormData({
      managerId: '',
      parentManagerId: '',
      level: 'A',
      commissionRate: 10,
    });
    setEditingNode(null);
    setShowAddForm(false);
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="page-header">
          <div className="container-app py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary-600 mr-4" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Genealogy Management
                  </h1>
                  <p className="text-gray-600">
                    Manage Team-Manager downline assignments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container-app page-content">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl flex items-center">
              <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
              <p className="text-success-700">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 text-error-600 mr-3" />
              <p className="text-error-700">{error}</p>
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingNode ? 'Edit Assignment' : 'Add New Assignment'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Live Manager ID
                    </label>
                    <input
                      type="text"
                      value={formData.managerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value }))}
                      className="input-field"
                      placeholder="Live Manager UUID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Manager ID
                    </label>
                    <input
                      type="text"
                      value={formData.parentManagerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentManagerId: e.target.value }))}
                      className="input-field"
                      placeholder="Team Manager UUID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <Select
                      options={levels}
                      value={formData.level}
                      onChange={(value) => setFormData(prev => ({ ...prev, level: value as 'A' | 'B' | 'C' }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) }))}
                      className="input-field"
                      min="0"
                      max="100"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex items-center"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        {editingNode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingNode ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Genealogy Table */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Current Assignments
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600">Loading genealogy data...</p>
              </div>
            ) : genealogyNodes.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Assignments Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first genealogy assignment to get started.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Add Assignment
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Live Manager
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Manager
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {genealogyNodes.map((node) => (
                      <tr key={node.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">{node.manager.name}</p>
                            <p className="text-sm text-gray-500">{node.manager.type.toUpperCase()}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">{node.parentManager.name}</p>
                            <p className="text-sm text-gray-500">{node.parentManager.type.toUpperCase()}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            node.level === 'A' ? 'bg-green-100 text-green-800' :
                            node.level === 'B' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Level {node.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {node.commissionRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(node.createdAt).toLocaleDateString('de-DE')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(node)}
                              className="text-primary-600 hover:text-primary-800 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(node.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 