import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit3, Search, ArrowLeft, ArrowRight, UserCheck, UserX } from 'lucide-react';
import apiService from '../../services/apiService';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.admin.getUsers({
        page,
        size: 10,
        search: searchQuery
      });
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      toast.error('Failed to load user directory.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    setPage(0);
  };

  const handleToggleStatus = async (user) => {
    const isCurrentlyEnabled = user.enabled !== false;
    const newStatus = !isCurrentlyEnabled;
    const actionName = newStatus ? 'enable' : 'disable';

    if (!window.confirm(`Are you sure you want to ${actionName} user "${user.username}"?`)) return;

    try {
      // Use general PUT /api/admin/users/{id}
      await apiService.admin.updateUser(user.id, { enabled: newStatus });
      toast.success(`User "${user.username}" successfully ${newStatus ? 'enabled' : 'disabled'}.`);
      loadUsers();
    } catch (err) {
      toast.error('Failed to update account status.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-gray-100">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Member Directory</h1>
        <p className="text-gray-400 text-sm">Manage user authorizations, roles, and profiles</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by username or email address..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl outline-none text-white text-sm transition focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 bg-gray-900 hover:bg-gray-855 border border-gray-800 hover:border-gray-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs font-bold text-gray-500 uppercase border-b border-gray-800">
                  <tr>
                    <th className="pb-3 pl-2">User Details</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Access Roles</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.length > 0 ? (
                    users.map((u) => {
                      const isEnabled = u.enabled !== false;
                      return (
                        <tr key={u.id} className="hover:bg-gray-850/50 transition">
                          <td className="py-4 pl-2 font-semibold text-white">
                            <div>{u.username}</div>
                            <div className="text-[10px] text-gray-500 capitalize">
                              {u.firstName || ''} {u.lastName || ''}
                            </div>
                          </td>
                          <td className="py-4 text-xs">{u.email}</td>
                          <td className="py-4 space-x-1">
                            {u.roles && u.roles.map(role => (
                              <span key={role} className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                role === 'ROLE_ADMIN' ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-800 text-gray-400'
                              }`}>
                                {role.replace('ROLE_', '')}
                              </span>
                            ))}
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {isEnabled ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-4 text-right pr-2 space-x-2">
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`inline-flex p-2 rounded-lg transition cursor-pointer ${
                                isEnabled 
                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' 
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                              }`}
                              title={isEnabled ? 'Disable user' : 'Enable user'}
                            >
                              {isEnabled ? <UserX size={14} /> : <UserCheck size={14} />}
                            </button>
                            <Link
                              to={`/admin/users/edit/${u.id}`}
                              className="inline-flex p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition"
                              title="Edit user roles"
                            >
                              <Edit3 size={14} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-500">
                        No users registered matching search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-800 text-xs">
                <span className="text-gray-500 font-semibold">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-855 hover:bg-gray-800 disabled:opacity-40 text-gray-300 font-bold rounded-xl transition border border-gray-800 cursor-pointer"
                  >
                    <ArrowLeft size={13} /> Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-855 hover:bg-gray-800 disabled:opacity-40 text-gray-300 font-bold rounded-xl transition border border-gray-800 cursor-pointer"
                  >
                    Next <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
