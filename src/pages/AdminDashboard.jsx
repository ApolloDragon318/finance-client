import { useEffect, useState } from 'react'
import api from '../api/axios'
import Graphs from '../components/Graphs'
import UsersTable from '../components/UsersTable'
import Modal from '../components/Modal'
import UserForm from '../components/UserForm'

export default function AdminDashboard() {
	const [users, setUsers] = useState([])
	const [stats, setStats] = useState(null)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		refresh()
	}, [])

	async function refresh() {
		const [u, s] = await Promise.all([
			api.get('/users'),
			api.get('/dashboard/stats')
		])
		setUsers(u.data)
		setStats(s.data)
	}

	return (
		<div className="container my-6 space-y-6">
			<h2 className="text-2xl font-bold">Admin Dashboard</h2>
			<div className="card p-6">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-lg font-semibold">All Users</h3>
					<button className="btn-primary" onClick={()=>setOpen(true)}>Create User</button>
				</div>
				<UsersTable users={users} onChanged={refresh} />
			</div>
			<div className="card p-6">
				<Graphs stats={stats} />
			</div>
			<Modal open={open} title="Create User" onClose={()=>setOpen(false)}>
				<UserForm onSaved={async()=>{await refresh(); setOpen(false)}} />
			</Modal>
		</div>
	)
}


