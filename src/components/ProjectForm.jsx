import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

export default function ProjectForm({ initial, users, onSaved }) {
	const [form, setForm] = useState(initial || {
		idName: '',
		fullName: '',
		owner: '',
		assignedAdmin: '',
		startDate: '',
		bankAddress: '',
		status: 'active',
		percentage: 50
	})
	const [saving, setSaving] = useState(false)
	const isEdit = Boolean(initial && initial._id)

	const ownerUser = useMemo(() => users.find(u => u._id === form.owner), [users, form.owner])
	const ownerIsAdmin = ownerUser?.role === 'admin'

	useEffect(() => {
		if (ownerIsAdmin) {
			setForm(prev => ({ ...prev, assignedAdmin: prev.owner, percentage: 100 }))
		}
	}, [ownerIsAdmin])

	function update(field, value) {
		setForm(prev => ({ ...prev, [field]: value }))
	}

	async function submit(e) {
		e.preventDefault()
		setSaving(true)
		try {
			if (isEdit) {
				// Only allow updating these fields on edit
				const payload = {
					fullName: form.fullName,
					status: form.status,
					percentage: form.percentage,
					bankAddress: form.bankAddress
				}
				await api.put(`/projects/${initial._id}`, payload)
			} else {
				await api.post('/projects', form)
			}
			onSaved()
		} finally {
			setSaving(false)
		}
	}

	return (
		<form onSubmit={submit} className="space-y-4">
			{!isEdit && (
				<>
					<div>
						<label className="label">ID Name (XXX-XXX)</label>
						<input className="input" value={form.idName} onChange={e => update('idName', e.target.value.toUpperCase())} required pattern="[A-Z0-9]{3}-[A-Z0-9]{3}" />
					</div>
					<div>
						<label className="label">Owner (User)</label>
						<select className="input" value={form.owner} onChange={e => update('owner', e.target.value)} required>
							<option value="">Select owner</option>
							{users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email}) [{u.role}]</option>)}
						</select>
					</div>
					{!ownerIsAdmin && (
						<div>
							<label className="label">Assigned Admin</label>
							<select className="input" value={form.assignedAdmin} onChange={e => update('assignedAdmin', e.target.value)} required>
								<option value="">Select admin</option>
								{users.filter(u=>u.role==='admin').map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
							</select>
						</div>
					)}
					<div>
						<label className="label">Start Date</label>
						<input type="date" className="input" value={form.startDate?.slice(0,10) || ''} onChange={e => update('startDate', e.target.value)} required />
					</div>
				</>
			)}
			<div>
				<label className="label">Full Name</label>
				<input className="input" value={form.fullName} onChange={e => update('fullName', e.target.value)} required />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="label">Status</label>
					<select className="input" value={form.status} onChange={e => update('status', e.target.value)}>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
				<div>
					<label className="label">Percentage</label>
					<input type="number" min="0" max="100" className="input" value={form.percentage} onChange={e => update('percentage', Number(e.target.value))} readOnly={ownerIsAdmin} />
				</div>
			</div>
			<div>
				<label className="label">Bank Address</label>
				<input className="input" value={form.bankAddress} onChange={e => update('bankAddress', e.target.value)} required />
			</div>
			<div className="flex justify-end gap-2">
				<button type="submit" className="btn-primary">{saving ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}</button>
			</div>
		</form>
	)
}




