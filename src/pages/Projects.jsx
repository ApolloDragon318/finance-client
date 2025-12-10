import { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'
import ProjectForm from '../components/ProjectForm'

export default function Projects() {
	const [projects, setProjects] = useState([])
	const [users, setUsers] = useState([])
	const [open, setOpen] = useState(false)
	const [editing, setEditing] = useState(null)
	const [q, setQ] = useState('')
	const user = JSON.parse(localStorage.getItem('user') || '{}')

	useEffect(() => {
		refresh()
	}, [])

	async function refresh() {
		const [p, u] = await Promise.all([
			api.get('/projects'),
			api.get('/users')
		])
		setProjects(p.data)
		setUsers(u.data)
	}

	function openCreate() {
		setEditing(null)
		setOpen(true)
	}
	function openEdit(p) {
		setEditing(p)
		setOpen(true)
	}
	function closeModal() {
		setOpen(false)
	}

	return (
		<div className="container my-6 space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Projects</h2>
				<div className="flex items-center gap-2">
					<input className="input" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
					{user.role === 'admin' && <button className="btn-primary" onClick={openCreate}>Create Project</button>}
				</div>
			</div>
			<div className="overflow-x-auto rounded-xl border border-gray-200">
				<table className="min-w-full text-sm">
					<thead className="bg-gray-50">
						<tr>
							<th className="text-left px-4 py-3 font-semibold">ID Name</th>
							<th className="text-left px-4 py-3 font-semibold">Full Name</th>
							<th className="text-left px-4 py-3 font-semibold">Owner</th>
							<th className="text-left px-4 py-3 font-semibold">Assigned Admin</th>
							<th className="text-left px-4 py-3 font-semibold">Status</th>
							<th className="text-left px-4 py-3 font-semibold">Percentage</th>
							{user.role === 'admin' && <th className="text-left px-4 py-3 font-semibold">Actions</th>}
						</tr>
					</thead>
					<tbody>
						{projects.filter(p => (p.idName + ' ' + p.fullName).toLowerCase().includes(q.toLowerCase())).map(p => (
							<tr key={p._id} className="border-t">
								<td className="px-4 py-3">{p.idName}</td>
								<td className="px-4 py-3">{p.fullName}</td>
								<td className="px-4 py-3">{p.owner?.name} ({p.owner?.email})</td>
								<td className="px-4 py-3">{p.assignedAdmin?.name} ({p.assignedAdmin?.email})</td>
								<td className="px-4 py-3">{p.status}</td>
								<td className="px-4 py-3">{p.percentage}%</td>
								{user.role === 'admin' && (
									<td className="px-4 py-3">
										<button className="btn-secondary" onClick={()=>openEdit(p)}>Edit</button>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Modal open={open} title={editing ? 'Edit Project' : 'Create Project'} onClose={closeModal}>
				<ProjectForm initial={editing} users={users} onSaved={async()=>{await refresh(); closeModal()}} />
			</Modal>
		</div>
	)
}


