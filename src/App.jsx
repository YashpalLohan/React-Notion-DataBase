import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Database, Trash2, AlertCircle, CheckCircle, Sparkles, Activity } from 'lucide-react';

const App = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newItem, setNewItem] = useState({ 
    title: '', 
    description: '',
    status: 'Not Started'
  });

  // Backend API base URL
  const API_BASE = 'http://localhost:3001/api';

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetch items from backend
  const fetchItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/items`);
      const result = await response.json();
      
      if (result.success) {
        setItems(result.data);
        setSuccess(`Loaded ${result.count} items from Notion`);
      } else {
        throw new Error(result.error || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(`Failed to fetch items: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add new item via backend
  const addItem = async () => {
    if (!newItem.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newItem.title.trim(),
          description: newItem.description.trim(),
          status: newItem.status
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setItems(prev => [result.data, ...prev]);
        setNewItem({ title: '', description: '', status: 'Not Started' });
        setSuccess('Item added to Notion successfully!');
      } else {
        throw new Error(result.error || 'Failed to add item');
      }
    } catch (err) {
      console.error('Error adding item:', err);
      setError(`Failed to add item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete/Archive item via backend
  const deleteItem = async (id) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        setItems(prev => prev.filter(item => item.id !== id));
        setSuccess('Item archived in Notion');
      } else {
        throw new Error(result.error || 'Failed to archive item');
      }
    } catch (err) {
      console.error('Error archiving item:', err);
      setError(`Failed to archive item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check backend health
  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Backend connection successful!');
      } else {
        throw new Error('Backend health check failed');
      }
    } catch (err) {
      setError('Backend not responding. Make sure it\'s running on port 3001');
    }
  };

  // Load items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 shadow-amber-100/50';
      case 'Completed': return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 shadow-emerald-100/50';
      case 'Not Started': return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200 shadow-slate-100/50';
      default: return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 shadow-blue-100/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Progress': return <Activity className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Not Started': return <div className="w-4 h-4 rounded-full border-2 border-current opacity-60" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* All CSS styles included inline */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shimmer {
            0% { 
              background-position: 200% 0; 
            }
            100% { 
              background-position: -200% 0; 
            }
          }
          
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px); 
            }
            50% { 
              transform: translateY(-10px); 
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out both;
          }
          
          .animate-slideIn {
            animation: slideIn 0.5s ease-out;
          }
          
          .animate-shimmer {
            background: linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
          
          .dark .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
          }
          
          .glass {
            backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .dark .glass {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .gradient-card {
            background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          }
          
          .dark .gradient-card {
            background: linear-gradient(145deg, rgba(0,0,0,0.2), rgba(0,0,0,0.1));
          }
          
          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
          
          .dark .hover-lift:hover {
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }
          
          .btn-shine {
            position: relative;
            overflow: hidden;
          }
          
          .btn-shine::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }
          
          .btn-shine:hover::before {
            left: 100%;
          }
          
          .status-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `
      }} />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100 p-4 lg:p-8 transition-all duration-500">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-violet-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          {/* Header */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-3xl p-8 lg:p-12 border border-white/20 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 group">
            <div className="flex items-center gap-8 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Database className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-600 bg-clip-text text-transparent mb-2 tracking-tight">
                  Notion Hub
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">Seamlessly connected to your workspace</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full status-pulse shadow-lg shadow-emerald-500/50"></div>
                  <span>Live Connection</span>
                </div>
              </div>
            </div>

            {/* Enhanced Status Messages */}
            {error && (
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 border border-red-200/50 dark:border-red-800/50 rounded-2xl mb-8 backdrop-blur-sm shadow-lg animate-slideIn" role="alert">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-red-700 dark:text-red-300 font-semibold text-lg">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border border-emerald-200/50 dark:border-emerald-800/50 rounded-2xl mb-8 backdrop-blur-sm shadow-lg animate-slideIn" role="status">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-lg">{success}</span>
              </div>
            )}

            {/* Enhanced Form */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Title</label>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-6 py-4 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-600/30 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-lg hover:shadow-xl text-lg backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Description</label>
                  <input
                    type="text"
                    placeholder="Add some details..."
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-6 py-4 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-600/30 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-lg hover:shadow-xl text-lg backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Status</label>
                  <select
                    value={newItem.status}
                    onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value }))}
                    className="px-6 py-4 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-600/30 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 shadow-lg hover:shadow-xl text-lg backdrop-blur-sm"
                    disabled={loading}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-8">
                  <button
                    onClick={addItem}
                    disabled={loading || !newItem.title.trim()}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover-lift font-semibold text-lg btn-shine"
                  >
                    <Plus className="w-6 h-6" />
                    <span>{loading ? 'Adding...' : 'Add to Notion'}</span>
                  </button>
                  
                  <button
                    onClick={fetchItems}
                    disabled={loading}
                    className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-2xl hover:from-slate-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover-lift font-semibold"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>

                  <button
                    onClick={checkBackend}
                    disabled={loading}
                    className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-2xl hover:from-emerald-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover-lift font-semibold"
                  >
                    <Database className="w-5 h-5" />
                    Test Backend
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-6">
            {loading && items.length === 0 ? (
              <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50">
                <div className="relative inline-block">
                  <RefreshCw className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-600 dark:text-blue-400" />
                  <div className="absolute inset-0 w-16 h-16 bg-blue-600/20 dark:bg-blue-400/20 rounded-full animate-ping"></div>
                </div>
                <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400">Loading your workspace...</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Syncing with Notion</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-3xl p-16 text-center border border-white/20 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500">
                <div className="relative inline-block mb-8">
                  <Database className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600 animate-float" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your workspace awaits</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xl mb-8 max-w-md mx-auto">Ready to capture your ideas and turn them into reality?</p>
                <button
                  onClick={checkBackend}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold text-lg btn-shine"
                >
                  Check Connection
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover-lift group animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{item.title}</h3>
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 shadow-lg transition-all duration-300 ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          disabled={loading}
                          className="p-3 text-gray-400 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all duration-300 disabled:opacity-50 hover:scale-110"
                          title="Archive in Notion"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg lg:text-xl">{item.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500 border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Created: {new Date(item.created).toLocaleString()}</span>
                      </div>
                      <span className="font-mono bg-gray-100/80 dark:bg-gray-700/80 px-4 py-2 rounded-xl backdrop-blur-sm">ID: {item.id.slice(-8)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="mt-16 p-8 bg-gradient-to-r from-white/60 via-gray-50/60 to-white/60 dark:from-gray-800/60 dark:via-gray-900/60 dark:to-gray-800/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-3xl hover:shadow-3xl transition-all duration-500">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Backend Proxy Active</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">API Endpoint</p>
                  <code className="block bg-gray-100/80 dark:bg-gray-700/80 px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 font-mono text-lg backdrop-blur-sm shadow-inner">localhost:3001</code>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Items</p>
                  <span className="block text-3xl font-bold text-blue-600 dark:text-blue-400">{items.length}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Integration</p>
                  <span className="block text-lg font-semibold text-gray-900 dark:text-gray-100">Notion Workspace</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;