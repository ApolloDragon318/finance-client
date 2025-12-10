import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Signup() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState('user')
	const [admins, setAdmins] = useState([])
	const [adminId, setAdminId] = useState('')
	const [msg, setMsg] = useState('')
	const [loading, setLoading] = useState(false)
	const user = useMemo(() => {
		const raw = localStorage.getItem('user')
		return raw ? JSON.parse(raw) : null
	}, [])
	const isAdmin = user?.role === 'admin'
	const publicSignup = String(import.meta.env.VITE_PUBLIC_SIGNUP || '').toLowerCase() === 'true'

	useEffect(() => {
		if (isAdmin) {
			api.get('/users').then(r => {
				const adminsOnly = r.data.filter(u => u.role === 'admin')
				setAdmins(adminsOnly)
				setAdminId(adminsOnly[0]?._id || '')
			})
		}
	}, [isAdmin])

	async function onSubmit(e) {
		e.preventDefault()
		setMsg('')
		setLoading(true)
		try {
			const payload = isAdmin
				? (role === 'admin' ? { name, email, password, role } : { name, email, password, role, adminId })
				: { name, email, password }
			await api.post('/auth/register', payload)
			setMsg('User created successfully.')
			toast.success('User created')
			setName('')
			setEmail('')
			setPassword('')
			setRole('user')
			setAdminId(admins[0]?._id || '')
		} catch (err) {
			setMsg(err?.response?.data?.message || 'Failed to create user')
			toast.error('Failed to create user')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-[70vh] flex items-center justify-center">
			<div className="card w-full max-w-md p-6">
				<h2 className="text-2xl font-bold">Create User</h2>
				<p className="text-sm text-gray-600 mt-1">
					{isAdmin ? 'Admin: create a new account' : (publicSignup ? 'Public signup is enabled' : 'Admin only')}
				</p>
				<form onSubmit={onSubmit} className="mt-4 space-y-3">
					<input className="input" placeholder="Username" value={name} onChange={e => setName(e.target.value)} required />
					<input className="input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
					<input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
					{isAdmin && (
						<select className="input" value={role} onChange={e => setRole(e.target.value)}>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					)}
					{isAdmin && role === 'user' && (
						<select className="input" value={adminId} onChange={e=>setAdminId(e.target.value)}>
							{admins.map(a => <option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
						</select>
					)}
					<button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button>
					{msg && <div className="text-sm">{msg}</div>}
				</form>
			</div>
		</div>
	)
}


