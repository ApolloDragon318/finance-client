import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'
import InvoiceForm from '../components/InvoiceForm'

export default function Invoices() {
	const [invoices, setInvoices] = useState([])
	const [projects, setProjects] = useState([])
	const [open, setOpen] = useState(false)
	const [selectedProject, setSelectedProject] = useState('')
	const [q, setQ] = useState('')
	const user = JSON.parse(localStorage.getItem('user') || '{}')

	useEffect(() => {
		refresh()
	}, [])

	async function refresh() {
		const [i, p] = await Promise.all([
			api.get('/invoices'),
			api.get('/projects')
		])
		setInvoices(i.data)
		setProjects(p.data)
	}

	function openCreate() {
		setSelectedProject(projects[0]?._id || '')
		setOpen(true)
	}
	function closeModal() {
		setOpen(false)
	}

	const projectOptions = useMemo(() => projects.map(p => ({
		id: p._id,
		label: `${p.idName} - ${p.fullName}`,
		percentage: p.percentage,
		adminId: p.assignedAdmin?._id,
		ownerIsAdmin: p.owner?.role === 'admin',
		ownerId: p.owner?._id
	})), [projects])
	const selectedMeta = useMemo(() => projectOptions.find(o => o.id === selectedProject) || {}, [projectOptions, selectedProject])

	return (
		<div className="container my-6 space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Invoices</h2>
				<div className="flex items-center gap-2">
					<input className="input" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
					{user.role === 'admin' && <button className="btn-primary" onClick={openCreate}>Create Invoice</button>}
				</div>
			</div>
			<div className="overflow-x-auto rounded-xl border border-gray-200">
				<table className="min-w-full text-sm">
					<thead className="bg-gray-50">
						<tr>
							<th className="text-left px-4 py-3 font-semibold">Project</th>
							<th className="text-left px-4 py-3 font-semibold">Pct</th>
							<th className="text-left px-4 py-3 font-semibold">Amount</th>
							<th className="text-left px-4 py-3 font-semibold">Income Date</th>
						</tr>
					</thead>
					<tbody>
						{invoices.filter(inv => {
							const term = q.toLowerCase()
							const proj = `${inv.projectId?.idName} ${inv.projectId?.fullName}`.toLowerCase()
							return proj.includes(term)
						}).map(inv => (
							<tr key={inv._id} className="border-t">
								<td className="px-4 py-3">{inv.projectId?.idName} - {inv.projectId?.fullName}</td>
								<td className="px-4 py-3">{inv.percentage}%</td>
								<td className={`px-4 py-3 ${Number(inv.amount) < 0 ? 'text-red-600' : ''}`}>
									{Number(inv.amount) < 0 ? `($${Math.abs(Number(inv.amount)).toLocaleString()})` : `$${Number(inv.amount).toLocaleString()}`}
								</td>
								<td className="px-4 py-3">{new Date(inv.incomeDate).toISOString().slice(0, 10)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Modal open={open} title="Create Invoice" onClose={closeModal}>
				<div className="space-y-4">
					<div>
						<label className="label">Project</label>
						<select className="input" value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}>
							{projectOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
						</select>
					</div>
					<InvoiceForm
						projectId={selectedProject}
						percentage={selectedMeta.percentage}
						onSaved={async()=>{await refresh(); closeModal()}}
					/>
				</div>
			</Modal>
		</div>
	)
}


