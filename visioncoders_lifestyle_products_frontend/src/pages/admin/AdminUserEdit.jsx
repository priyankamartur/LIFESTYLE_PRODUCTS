import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';
import apiService from '../../services/apiService';

export default function AdminUserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [roles, setRoles] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await apiService.admin.getUserById(id);
        setUser(res);
        setEnabled(res.enabled !== false);
        setRoles(res.roles || []);
        setUsername(res.username || '');
        setEmail(res.email || '');
        setPassword('');
      } catch (err) {
        toast.error('Failed to load user details.');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id, navigate]);

  const handleRoleToggle = (role) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roles.length === 0) {
      toast.warning('A user must retain at least one role permission.');
      return;
    }
    setSubmitting(true);
    const payload = {
      enabled,
      roles,
      username: username.trim(),
      email: email.trim(),
    };
    if (password && password.trim() !== '') {
      payload.password = password.trim();
    }
    try {
      await apiService.admin.updateUser(id, payload);
      toast.success('User profile updated successfully.');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.message || 'Failed to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fadeIn text-gray-100 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-850 hover:border-gray-700 text-gray-300 hover:text-white rounded-xl transition cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Member</h1>
          <p className="text-gray-400 text-sm">Update authorizations and role assignments</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Meta Inputs */}
          <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl space-y-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Member Credentials
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-300" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                required
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl outline-none text-white text-sm focus:border-amber-500 transition"
                placeholder="Username"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-300" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl outline-none text-white text-sm focus:border-amber-500 transition"
                placeholder="Email address"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-300" htmlFor="password">
                Reset Password (Optional)
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl outline-none text-white text-sm focus:border-amber-500 transition"
                placeholder="Leave blank to retain existing password"
              />
            </div>

            <div className="text-xs text-gray-500 capitalize pt-2 border-t border-gray-900">
              Full Name: {user?.firstName || 'Not'} {user?.lastName || 'Provided'}
            </div>
          </div>

          {/* Enabled Switch */}
          <div className="flex items-center justify-between bg-gray-950 border border-gray-855 p-5 rounded-2xl">
            <div>
              <div className="text-sm font-semibold text-white">Account Status</div>
              <div className="text-xs text-gray-500">Enable or disable this member's access to the website</div>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-10 h-6 bg-gray-800 rounded-full border-gray-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
              disabled={submitting}
            />
          </div>

          {/* Roles Checkboxes */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Role Authorizations
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition select-none ${
                roles.includes('ROLE_USER') 
                  ? 'bg-amber-500/10 border-amber-500 text-white' 
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={roles.includes('ROLE_USER')}
                  onChange={() => handleRoleToggle('ROLE_USER')}
                  className="hidden"
                  disabled={submitting}
                />
                <span className="text-sm font-semibold">ROLE_USER (Customer)</span>
              </label>

              <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition select-none ${
                roles.includes('ROLE_ADMIN') 
                  ? 'bg-amber-500/10 border-amber-500 text-white' 
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={roles.includes('ROLE_ADMIN')}
                  onChange={() => handleRoleToggle('ROLE_ADMIN')}
                  className="hidden"
                  disabled={submitting}
                />
                <span className="text-sm font-semibold">ROLE_ADMIN (Admin)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-750 text-gray-300 font-bold rounded-xl text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
