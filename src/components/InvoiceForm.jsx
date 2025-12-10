import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function InvoiceForm({ projectId, percentage, ownerIsAdmin, onSaved }) {
	const [amount, setAmount] = useState('')
	const [incomeDate, setIncomeDate] = useState('')
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
			await api.post('/invoices', { projectId, amount: Number(amount), incomeDate })
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
				<label className="label">Amount</label>
				<input type="number" min="0" step="0.01" className="input" value={amount} onChange={e => setAmount(e.target.value)} required />
			</div>
			<div>
				<label className="label">Income Date</label>
				<input type="date" className="input" value={incomeDate} onChange={e => setIncomeDate(e.target.value)} required />
			</div>
			<div className="flex justify-end">
				<button className="btn-primary" type="submit">{saving ? 'Saving...' : 'Create Invoice'}</button>
			</div>
		</form>
	)
}



