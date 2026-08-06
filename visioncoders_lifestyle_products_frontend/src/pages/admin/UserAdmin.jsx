import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, ShieldAlert, ArrowLeft, ArrowRight, Save, X } from 'lucide-react';
import apiService from '../../services/apiService';

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search
  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Role Edit states
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRoles, setEditedRoles] = useState([]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const pagedData = await apiService.admin.getUsers({
        page,
        size: 10,
        search: searchQuery
      });
      if (pagedData) {
        setUsers(pagedData.content || []);
        setTotalPages(pagedData.totalPages || 0);
      }
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    setPage(0);
  };

  const handleToggleStatus = async (user) => {
    const actionName = user.enabled ? 'disable' : 'enable';
    if (!window.confirm(`Are you sure you want to ${actionName} user "${user.username}"?`)) return;

    try {
      if (user.enabled) {
        await apiService.admin.disableUser(user.id);
        toast.info(`User "${user.username}" disabled.`);
      } else {
        await apiService.admin.enableUser(user.id);
        toast.success(`User "${user.username}" enabled.`);
      }
      loadUsers();
    } catch (err) {
      toast.error('Failed to change account status.');
    }
  };

  const handleStartEditRoles = (user) => {
    setEditingUserId(user.id);
    setEditedRoles(user.roles || []);
  };

  const handleRoleCheckboxChange = (role) => {
    if (editedRoles.includes(role)) {
      setEditedRoles(editedRoles.filter(r => r !== role));
    } else {
      setEditedRoles([...editedRoles, role]);
    }
  };

  const handleSaveRoles = async (userId) => {
    if (editedRoles.length === 0) {
      toast.warning('A user must retain at least one role permission.');
      return;
    }

    try {
      await apiService.admin.updateUserRoles(userId, editedRoles);
      toast.success('User roles updated successfully.');
      setEditingUserId(null);
      loadUsers();
    } catch (err) {
      toast.error('Failed to update roles.');
    }
  };

  const styles = {
    subbar: 'flex gap-4 border-b border-white/5 pb-4 mb-8',
    subLink: 'px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 transition hover:text-white',
    activeSubLink: 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary',
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">User Directory Admin</h1>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-lg text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert size={14} />
          Directory Control
        </span>
      </div>

      {/* Admin subbar navigation */}
      <div className={styles.subbar}>
        <Link to="/admin/dashboard" className={styles.subLink}>
          Analytics Overview
        </Link>
        <Link to="/admin/products" className={styles.subLink}>
          Products Management
        </Link>
        <Link to="/admin/users" className={`${styles.subLink} ${styles.activeSubLink}`}>
          Users Management
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-surface/50 border border-white/5 p-5 rounded-2xl">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-2.5 bg-bg-surface border border-white/10 focus:border-brand-primary rounded-xl outline-none text-white text-sm"
            placeholder="Search users by name, username, or email..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </form>
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
          Registered Accounts Directory
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-3 border-gray-700 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Roles</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4">
                      <div>
                        <div className="font-semibold text-white">
                          {user.firstName || 'No name'} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="font-bold text-white">{user.username}</td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`badge cursor-pointer border ${
                          user.enabled 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                        title={user.enabled ? "Click to Disable" : "Click to Enable"}
                      >
                        {user.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <div className="flex flex-col gap-1 p-2 bg-bg-elevated border border-white/10 rounded-lg max-w-[150px]">
                          <label className="flex items-center gap-2 text-xs font-bold text-gray-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editedRoles.includes('ROLE_USER')}
                              onChange={() => handleRoleCheckboxChange('ROLE_USER')}
                            />
                            ROLE_USER
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-gray-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editedRoles.includes('ROLE_ADMIN')}
                              onChange={() => handleRoleCheckboxChange('ROLE_ADMIN')}
                            />
                            ROLE_ADMIN
                          </label>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.map((r, i) => (
                            <span
                              key={i}
                              className={`badge ${
                                r === 'ROLE_ADMIN' 
                                  ? 'bg-brand-accent/10 border border-brand-accent/20 text-brand-accent' 
                                  : 'bg-white/5 border border-white/10 text-gray-400'
                              }`}
                            >
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="text-right py-4">
                      {editingUserId === user.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveRoles(user.id)}
                            className="p-2 bg-brand-primary text-white rounded-xl shadow-md cursor-pointer hover:opacity-90"
                            title="Save roles"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl cursor-pointer"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleStartEditRoles(user)}
                            className="px-3.5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold rounded-xl text-gray-300 hover:text-white transition cursor-pointer"
                          >
                            Manage Roles
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`px-3.5 py-2 text-xs font-bold rounded-xl w-20 transition cursor-pointer ${
                              user.enabled 
                                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' 
                                : 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white'
                            }`}
                          >
                            {user.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))} className="flex items-center gap-1.5 px-4 py-2 bg-bg-surface border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white disabled:opacity-40 transition cursor-pointer">
                <ArrowLeft size={14} /> Prev
              </button>
              <span className="text-sm text-gray-400 font-medium">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} className="flex items-center gap-1.5 px-4 py-2 bg-bg-surface border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white disabled:opacity-40 transition cursor-pointer">
                Next <ArrowRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
