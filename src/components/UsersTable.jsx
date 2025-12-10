import api from '../api/axios'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from './Modal'

export default function UsersTable({ users, onChanged }) {
	const [savingId, setSavingId] = useState(null)
	const [open, setOpen] = useState(false)
	const [edit, setEdit] = useState(null)
	const admins = useMemo(() => users.filter(u=>u.role==='admin'), [users])
	async function deleteUser(id) {
		if (!confirm('Delete this user?')) return
		setSavingId(id)
		try {
			await api.delete(`/users/${id}`)
			toast.success('User deleted')
			onChanged()
		} finally {
			setSavingId(null)
		}
	}
	function startEdit(u) {
		setEdit({
			id: u._id,
			name: u.name,
			email: u.email,
			role: u.role,
			adminId: u.adminId || ''
		})
		setOpen(true)
	}
	async function submitEdit(e) {
		e.preventDefault()
		try {
			await api.patch(`/users/${edit.id}`, {
				name: edit.name,
				email: edit.email,
				role: edit.role,
				adminId: edit.role === 'user' ? edit.adminId : undefined
			})
			toast.success('User updated')
			setOpen(false)
			onChanged()
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Update failed')
		}
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-gray-200">
			<table className="min-w-full text-sm">
				<thead className="bg-gray-50">
					<tr>
						<th className="text-left px-4 py-3 font-semibold">Name</th>
						<th className="text-left px-4 py-3 font-semibold">Email</th>
						<th className="text-left px-4 py-3 font-semibold">Role</th>
						<th className="text-left px-4 py-3 font-semibold">Projects</th>
						<th className="text-left px-4 py-3 font-semibold">Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map(u => (
						<tr key={u._id} className="border-t">
							<td className="px-4 py-3">{u.name}</td>
							<td className="px-4 py-3">{u.email}</td>
							<td className="px-4 py-3">
								<span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
									{u.role}
								</span>
							</td>
							<td className="px-4 py-3">{u.projectCount}</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<button className="btn-secondary" onClick={()=>startEdit(u)}>Edit</button>
									<button disabled={savingId===u._id} className="btn-secondary" onClick={()=>deleteUser(u._id)}>
										{savingId===u._id ? '...' : 'Delete'}
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Modal open={open} title="Edit User" onClose={()=>setOpen(false)}>
				<form className="space-y-3" onSubmit={submitEdit}>
					<div>
						<label className="label">Name</label>
						<input className="input" value={edit?.name||''} onChange={e=>setEdit(prev=>({...prev, name:e.target.value}))} required />
					</div>
					<div>
						<label className="label">Email</label>
						<input className="input" type="email" value={edit?.email||''} onChange={e=>setEdit(prev=>({...prev, email:e.target.value}))} required />
					</div>
					<div>
						<label className="label">Role</label>
						<select className="input" value={edit?.role||'user'} onChange={e=>setEdit(prev=>({...prev, role:e.target.value}))}>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					{edit?.role==='user' && (
						<div>
							<label className="label">Supervising Admin</label>
							<select className="input" value={edit?.adminId||''} onChange={e=>setEdit(prev=>({...prev, adminId:e.target.value}))} required>
								{admins.map(a => <option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
							</select>
						</div>
					)}
					<div className="flex justify-end">
						<button className="btn-primary" type="submit">Save</button>
					</div>
				</form>
			</Modal>
		</div>
	)
}


