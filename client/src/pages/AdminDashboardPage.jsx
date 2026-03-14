import { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', score: 0, isAdmin: false });

    // Fetch users on load
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/users');
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handlers
    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter((user) => user._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user._id);
        setEditForm({ username: user.username, score: user.score, isAdmin: user.isAdmin });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/admin/users/${editingUser}`, editForm);
            setUsers(users.map((u) => (u._id === editingUser ? data : u)));
            setEditingUser(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update user');
        }
    };

    if (loading) return <div>Loading Admin Dashboard...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <p>Manage all registered users below.</p>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Score</th>
                        <th>Admin Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            {editingUser === user._id ? (
                                // ==== EDIT MODE ====
                                <td colSpan="4">
                                    <form onSubmit={handleEditSubmit} className="edit-form">
                                        <input
                                            type="text"
                                            value={editForm.username}
                                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            value={editForm.score}
                                            onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) || 0 })}
                                        />
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={editForm.isAdmin}
                                                onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                                            />
                                            Is Admin
                                        </label>
                                        <div className="edit-actions">
                                            <button type="submit" className="save-btn">Save</button>
                                            <button type="button" onClick={() => setEditingUser(null)} className="cancel-btn">Cancel</button>
                                        </div>
                                    </form>
                                </td>
                            ) : (
                                // ==== VIEW MODE ====
                                <>
                                    <td>{user.username}</td>
                                    <td>{user.score}</td>
                                    <td>{user.isAdmin ? <span className="badge true">Admin</span> : <span className="badge false">Player</span>}</td>
                                    <td className="actions-cell">
                                        <button onClick={() => handleEditClick(user)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDelete(user._id)} className="delete-btn">Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboardPage;
