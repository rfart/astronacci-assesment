import React from 'react';

interface Props {
  users: any[];
  usersLoading: boolean;
}

const UserManagement: React.FC<Props> = ({ users, usersLoading }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">User Management</h2>
      {usersLoading ? (
        <div>Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="px-2 py-1 border">Name</th>
                <th className="px-2 py-1 border">Email</th>
                <th className="px-2 py-1 border">Role</th>
                <th className="px-2 py-1 border">Membership</th>
                <th className="px-2 py-1 border">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td className="px-2 py-1 border">{u.name}</td>
                  <td className="px-2 py-1 border">{u.email}</td>
                  <td className="px-2 py-1 border capitalize">{u.role}</td>
                  <td className="px-2 py-1 border">{u.membershipTier}</td>
                  <td className="px-2 py-1 border">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
