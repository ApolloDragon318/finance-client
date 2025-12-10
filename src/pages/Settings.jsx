import { useState } from 'react'
import api from '../api/axios'

export default function Settings() {
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [msg, setMsg] = useState('')

	async function onChangePassword(e) {
		e.preventDefault()
		setMsg('')
		try {
			await api.post('/auth/change-password', { oldPassword, newPassword })
			setMsg('Password changed.')
			setOldPassword('')
			setNewPassword('')
		} catch (err) {
			setMsg(err?.response?.data?.message || 'Failed to change password')
		}
	}

	return (
		<div style={{ maxWidth: 480, margin: '24px auto', padding: '0 16px' }}>
			<h2>Settings</h2>
			<form onSubmit={onChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
				<input placeholder="Old password" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
				<input placeholder="New password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
				<button type="submit">Change Password</button>
				{msg && <div>{msg}</div>}
			</form>
		</div>
	)
}


