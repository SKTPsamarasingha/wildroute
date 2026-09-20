'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, UserRole } from '@/types/auth';
import { getUsers, updateUserRoleAndPermissions, SUPERADMIN_EMAIL } from '@/services/userService';
import { Users, Shield, Lock, Search, Crown, Check, Edit2, X, UserPlus, ShieldAlert, KeyRound, Mail, User as UserIcon } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const AVAILABLE_PERMISSIONS = [
  { id: 'manage_products', label: 'Manage Products & Catalog' },
  { id: 'manage_tours', label: 'Manage Expeditions & Tours' },
  { id: 'manage_orders', label: 'Manage & Fulfill Orders & Bookings' },
  { id: 'manage_users', label: 'Manage Users, Roles & Permissions' },
  { id: 'view_analytics', label: 'View Gross Sales Analytics' },
  { id: 'manage_inventory', label: 'Adjust Stock & Inventory' },
];

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Editing Permissions Modal State (SuperAdmin Feature)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Create User Modal State (SuperAdmin Feature)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDisplayName, setCreateDisplayName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<UserRole>('staff');
  const [createPermissions, setCreatePermissions] = useState<string[]>(['manage_orders', 'manage_inventory']);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const isSuperAdmin = user?.role === 'superadmin' || user?.email === SUPERADMIN_EMAIL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  };

  if (loading) {
    return <LoadingSpinner label="Loading user accounts & permissions..." fullPage />;
  }

  const handleOpenAssignModal = (u: UserProfile) => {
    setErrorMsg('');
    if (u.email === SUPERADMIN_EMAIL || u.role === 'superadmin') {
      alert('PROTECTION RULE: SuperAdmin credentials cannot be updated, demoted, or altered.');
      return;
    }

    setSelectedUser(u);
    setSelectedRole(u.role);
    setSelectedPermissions(u.permissions || ['buy_products', 'book_tours']);
  };

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleToggleCreatePermission = (permId: string) => {
    setCreatePermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSaveRoleAndPermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await updateUserRoleAndPermissions(selectedUser.uid, selectedRole, selectedPermissions);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update user permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    setIsCreating(true);

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: createDisplayName,
          email: createEmail,
          password: createPassword,
          role: createRole,
          permissions: createPermissions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreateSuccess(`User ${createEmail} successfully created in Firebase Auth & Firestore!`);
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setCreateDisplayName('');
          setCreateEmail('');
          setCreatePassword('');
          setCreateRole('staff');
          setCreatePermissions(['manage_orders', 'manage_inventory']);
          setCreateSuccess('');
          fetchUsers();
        }, 1200);
      } else {
        setCreateError(data.error || 'Failed to create user account.');
      }
    } catch (err: any) {
      setCreateError(err.message || 'Server connection error.');
    } finally {
      setIsCreating(false);
    }
  };

  // Deduplicate users array by lowercased email or uid so no user is ever rendered twice
  const uniqueUsersMap = new Map<string, UserProfile>();
  users.forEach((u) => {
    const key = u.email ? u.email.toLowerCase() : u.uid;
    if (!uniqueUsersMap.has(key)) {
      uniqueUsersMap.set(key, u);
    }
  });

  const filteredUsers = Array.from(uniqueUsersMap.values()).filter(
    (u) =>
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2826]">
            User Role & Access Control (RBAC)
          </h1>
          <p className="text-xs text-[#5C6B66] mt-1">
            SuperAdmin portal to create accounts, assign roles, and manage capability permissions.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              setCreateError('');
              setCreateSuccess('');
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-[#23382B] hover:bg-[#192B20] text-white rounded-2xl text-xs font-semibold shadow-md transition shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Create New User
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-3">
          <Lock className="w-5 h-5 shrink-0" />
          <span>
            <strong>Role Permission Notice:</strong> You are logged in as a <strong>{user?.role.toUpperCase()}</strong>. Viewing users is enabled, but creating users and assigning custom roles/permissions is restricted to <strong>SuperAdmin</strong>.
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5DFD5] shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8E9B96]" />
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#23382B]"
          />
        </div>
        <span className="text-xs font-semibold text-[#6E8071]">{filteredUsers.length} Users Found</span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C2826]">
            <thead className="bg-[#FAF8F5] border-b border-[#E5DFD5] text-[11px] font-bold uppercase tracking-wider text-[#8E9B96]">
              <tr>
                <th className="py-4 px-6">User Profile</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Assigned Permissions</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {filteredUsers.map((u) => {
                const isSuperAdminAccount = u.email === SUPERADMIN_EMAIL || u.role === 'superadmin';
                return (
                  <tr key={u.uid} className="hover:bg-[#FAF8F5] transition">
                    <td className="py-4 px-6 font-bold text-[#1C2826]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#23382B] text-white flex items-center justify-center font-bold">
                          {u.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span>{u.displayName || 'Adventurer'}</span>
                        {isSuperAdminAccount && (
                          <span title="SuperAdmin Protected">
                            <Crown className="w-4 h-4 text-amber-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#5C6B66]">{u.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === 'superadmin'
                            ? 'bg-amber-600 text-white'
                            : u.role === 'admin'
                            ? 'bg-[#C86D51] text-white'
                            : u.role === 'staff'
                            ? 'bg-[#23382B] text-white'
                            : 'bg-[#F3EFEA] text-[#1C2826]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {isSuperAdminAccount ? (
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                            ALL PERMISSIONS (SUPERADMIN)
                          </span>
                        ) : (u.permissions || []).length > 0 ? (
                          (u.permissions || []).map((p) => (
                            <span key={p} className="bg-[#FAF8F5] text-[#23382B] border border-[#E5DFD5] px-2 py-0.5 rounded text-[10px]">
                              {p.replace('manage_', '')}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#8E9B96]">Basic Store Access</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenAssignModal(u)}
                        disabled={!isSuperAdmin || isSuperAdminAccount}
                        className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE3DA] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-[#1C2826] disabled:opacity-40"
                      >
                        {isSuperAdminAccount ? 'Protected' : 'Assign Permissions'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW USER MODAL (Firebase Auth + Firestore Sync) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-[#E5DFD5] space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-[#C86D51] uppercase tracking-wider block">
                SuperAdmin Management
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1C2826]">
                Create New User Account
              </h2>
              <p className="text-xs text-[#5C6B66]">
                Adds credentials to Firebase Authentication & Firestore User RBAC table simultaneously.
              </p>
            </div>

            {createError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {createError}
              </div>
            )}

            {createSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-semibold">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-[#1C2826] uppercase tracking-wider mb-1">
                  Full Name / Display Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-[#8E9B96]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Samarasinghe"
                    value={createDisplayName}
                    onChange={(e) => setCreateDisplayName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#23382B]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#1C2826] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#8E9B96]" />
                  <input
                    type="email"
                    required
                    placeholder="user@wildroute.lk"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#23382B]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#1C2826] uppercase tracking-wider mb-1">
                  Password (Min 6 characters)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-[#8E9B96]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#23382B]"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#1C2826] uppercase tracking-wider mb-2">
                  Select User Role
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                  {(['superadmin', 'admin', 'staff', 'customer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCreateRole(r)}
                      className={`p-2 rounded-xl border uppercase text-[11px] transition ${
                        createRole === r
                          ? 'bg-[#23382B] text-white border-[#23382B]'
                          : 'bg-[#FAF8F5] text-[#1C2826] border-[#E5DFD5] hover:bg-[#F3EFEA]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions Checkboxes */}
              {createRole !== 'superadmin' && (
                <div>
                  <label className="block text-xs font-bold text-[#1C2826] uppercase tracking-wider mb-2">
                    Select Role Capabilities
                  </label>
                  <div className="space-y-2 border border-[#E5DFD5] p-4 rounded-2xl bg-[#FAF8F5]">
                    {AVAILABLE_PERMISSIONS.map((perm) => {
                      const isChecked = createPermissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className="flex items-center gap-3 text-xs text-[#1C2826] cursor-pointer hover:text-[#23382B]"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCreatePermission(perm.id)}
                            className="w-4 h-4 accent-[#23382B] rounded"
                          />
                          <span>{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3 bg-[#23382B] hover:bg-[#192B20] text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                {isCreating ? 'Creating in Firebase Auth & Firestore...' : 'Create Account in Auth & DB'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN ROLE & PERMISSIONS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-[#E5DFD5] space-y-6">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-[#C86D51] uppercase tracking-wider block">
                SuperAdmin Feature
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1C2826]">
                Assign Role & Permissions for {selectedUser.displayName}
              </h2>
              <p className="text-xs text-[#5C6B66]">{selectedUser.email}</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveRoleAndPermissions} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#1C2826] uppercase tracking-wider mb-2">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {(['admin', 'staff', 'customer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`p-2.5 rounded-xl border uppercase transition ${
                        selectedRole === r
                          ? 'bg-[#23382B] text-white border-[#23382B]'
                          : 'bg-[#FAF8F5] text-[#1C2826] border-[#E5DFD5] hover:bg-[#F3EFEA]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Permission Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-[#1C2826] uppercase tracking-wider mb-2">
                  Assign Granular Capabilities
                </label>
                <div className="space-y-2 border border-[#E5DFD5] p-4 rounded-2xl bg-[#FAF8F5]">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className="flex items-center gap-3 text-xs text-[#1C2826] cursor-pointer hover:text-[#23382B]"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="w-4 h-4 accent-[#23382B] rounded"
                        />
                        <span>{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#23382B] hover:bg-[#192B20] text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                {isSubmitting ? 'Updating Database...' : 'Save Role & Permissions'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
