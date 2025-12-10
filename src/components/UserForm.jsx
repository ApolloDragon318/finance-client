import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function UserForm({ onSaved }) {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState('user')
	const [admins, setAdmins] = useState([])
	const [adminId, setAdminId] = useState('')
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		api.get('/users').then(r => {
			setAdmins(r.data.filter(u => u.role === 'admin'))
			setAdminId(r.data.filter(u => u.role === 'admin')[0]?._id || '')
		})
	}, [])

	async function submit(e) {
		e.preventDefault()
		setSaving(true)
		try {
			const payload = role === 'admin' ? { name, email, password, role } : { name, email, password, role, adminId }
			await api.post('/auth/register', payload)
			toast.success('User created')
			onSaved()
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Failed to create user')
		} finally {
			setSaving(false)
		}
	}

	return (
		<form onSubmit={submit} className="space-y-3">
			<div>
				<label className="label">Username</label>
				<input className="input" value={name} onChange={e=>setName(e.target.value)} required />
			</div>
			<div>
				<label className="label">Email</label>
				<input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
			</div>
			<div>
				<label className="label">Password</label>
				<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
			</div>
			<div>
				<label className="label">Role</label>
				<select className="input" value={role} onChange={e=>setRole(e.target.value)}>
					<option value="user">User</option>
					<option value="admin">Admin</option>
				</select>
			</div>
			{role === 'user' && (
				<div>
					<label className="label">Admin</label>
					<select className="input" value={adminId} onChange={e=>setAdminId(e.target.value)} required>
						{admins.map(a => <option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
					</select>
				</div>
			)}
			<div className="flex justify-end">
				<button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create User'}</button>
			</div>
		</form>
	)
}



