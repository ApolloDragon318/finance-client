import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function InvoiceForm({ projectId, percentage, ownerIsAdmin, onSaved }) {
	const [amount, setAmount] = useState('')
	const [incomeDate, setIncomeDate] = useState('')
	const [reason, setReason] = useState('')
	const [saving, setSaving] = useState(false)
	const [snapshotPct, setSnapshotPct] = useState(percentage ?? 0)

	useEffect(() => {
		setSnapshotPct(percentage ?? 0)
	}, [percentage])

	// no member selection; user share goes to project owner

	async function submit(e) {
		e.preventDefault()
		setSaving(true)
		try {
			await api.post('/invoices', { projectId, amount: Number(amount), incomeDate, reason: reason.trim() })
			onSaved()
		} finally {
			setSaving(false)
		}
	}

	return (
		<form onSubmit={submit} className="space-y-4">
			<div>
				<label className="label">Project Percentage (snapshot)</label>
				<input className="input" value={`${snapshotPct}%`} readOnly />
			</div>
			{/* Member selection removed; user share goes to owner */}
			<div>
				<label className="label">Amount (positive = income, negative = expense)</label>
				<input type="number" step="0.01" className="input" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g. 500 or -100" />
			</div>
			<div>
				<label className="label">Income Date</label>
				<input type="date" className="input" value={incomeDate} onChange={e => setIncomeDate(e.target.value)} required />
			</div>
			<div>
				<label className="label">Reason</label>
				<input type="text" className="input" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Client payment, Office supplies" />
			</div>
			<div className="flex justify-end">
				<button className="btn-primary" type="submit">{saving ? 'Saving...' : 'Create Invoice'}</button>
			</div>
		</form>
	)
}



