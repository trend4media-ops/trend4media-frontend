'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FileUpload } from '@/components/ui/FileUpload';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  uploadsApi, 
  UploadBatch 
} from '@/lib/api';
import { 
  CheckCircle, 
  AlertCircle, 
  FileSpreadsheet,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function AdminUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<UploadBatch[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadUploadHistory();
  }, []);

  const loadUploadHistory = async () => {
    try {
      const response = await uploadsApi.getUploadBatches();
      setRecentUploads(response.data.slice(0, 5)); // Show last 5 uploads
    } catch (err) {
      console.error('Failed to load upload history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    setUploadResult(null);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const response = await uploadsApi.uploadExcel(file);
      setUploadResult(response.data);
      loadUploadHistory(); // Refresh upload history
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMonth = (period: string) => {
    if (period.length === 6) {
      const year = period.substring(0, 4);
      const month = period.substring(4, 6);
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('de-DE', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return period;
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="page-header">
          <div className="container-app py-6">
            <div className="flex items-center">
              <FileSpreadsheet className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Excel Upload
                </h1>
                <p className="text-gray-600">
                  Upload monthly Excel files for commission processing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container-app page-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Area */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload New File
                </h2>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onUpload={handleUpload}
                  loading={uploading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="card p-6 border-error-200 bg-error-50">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-error-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-error-900">
                        Upload Failed
                      </h3>
                      <p className="text-error-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadResult && uploadResult.success && (
                <div className="card p-6 border-success-200 bg-success-50">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-success-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-success-900 mb-2">
                        Upload Successful!
                      </h3>
                      <p className="text-success-700 mb-4">
                        {uploadResult.message}
                      </p>
                      
                      {/* Upload Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white rounded-xl">
                          <p className="text-2xl font-bold text-gray-900">
                            {uploadResult.processedRows}
                          </p>
                          <p className="text-sm text-gray-600">Processed</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl">
                          <p className="text-2xl font-bold text-blue-600">
                            {uploadResult.newCreatorsCount}
                          </p>
                          <p className="text-sm text-gray-600">New Creators</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl">
                          <p className="text-2xl font-bold text-green-600">
                            {uploadResult.newManagersCount}
                          </p>
                          <p className="text-sm text-gray-600">New Managers</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl">
                          <p className="text-2xl font-bold text-purple-600">
                            {uploadResult.transactionsCreated}
                          </p>
                          <p className="text-sm text-gray-600">Transactions</p>
                        </div>
                      </div>

                      {/* Warnings */}
                      {uploadResult.warnings && uploadResult.warnings.length > 0 && (
                        <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-xl">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="w-5 h-5 text-warning-600 mr-2" />
                            <h4 className="font-medium text-warning-900">Warnings</h4>
                          </div>
                          <ul className="text-sm text-warning-700 space-y-1">
                            {uploadResult.warnings.map((warning: string, index: number) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload History Sidebar */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Uploads
                </h3>
                
                {loadingHistory ? (
                  <div className="text-center py-4">
                    <LoadingSpinner size="md" className="mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Loading history...</p>
                  </div>
                ) : recentUploads.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No uploads yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentUploads.map((upload) => (
                      <div 
                        key={upload.id} 
                        className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {formatMonth(upload.dataMonth)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(upload.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{upload.processedRows} rows</span>
                          <span>{upload.transactionsCreated} transactions</span>
                        </div>
                        {upload.warnings.length > 0 && (
                          <div className="mt-2 flex items-center text-xs text-warning-600">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {upload.warnings.length} warnings
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Guidelines */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload Guidelines
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-primary-500 mr-2 mt-0.5" />
                    <p>Upload files monthly for accurate commission processing</p>
                  </div>
                  <div className="flex items-start">
                    <FileSpreadsheet className="w-4 h-4 text-primary-500 mr-2 mt-0.5" />
                    <p>Only .xlsx files are supported</p>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-4 h-4 text-primary-500 mr-2 mt-0.5" />
                    <p>New creators and managers will be automatically created</p>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="w-4 h-4 text-primary-500 mr-2 mt-0.5" />
                    <p>Commission calculations are processed immediately</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 