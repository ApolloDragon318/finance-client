import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		try {
			const { data } = await api.post('/auth/login', { email, password })
			localStorage.setItem('token', data.token)
			localStorage.setItem('user', JSON.stringify(data.user))
			touchSuccess()
			navigate('/')
		} catch (err) {
			setError(err?.response?.data?.message || 'Login failed')
			toast.error('Login failed')
		}
	}

	function touchSuccess() {
		toast.success('Welcome back!')
	}

	return (
		<div className="min-h-[70vh] flex items-center justify-center">
			<div className="card w-full max-w-md p-6">
				<h2 className="text-2xl font-bold">Login</h2>
				<form onSubmit={onSubmit} className="mt-4 space-y-3">
					<input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
					<input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
					<button className="btn-primary w-full" type="submit">Login</button>
					{error && <div className="text-red-600 text-sm">{error}</div>}
				</form>
			</div>
		</div>
	)
}


