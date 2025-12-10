import { useEffect, useState } from 'react'
import api from '../api/axios'
import Graphs from '../components/Graphs'

export default function UserDashboard() {
	const [stats, setStats] = useState(null)

	useEffect(() => {
		api.get('/dashboard/stats').then(r => setStats(r.data))
	}, [])

	return (
		<div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
			<h2>Dashboard</h2>
			<Graphs stats={stats} />
		</div>
	)
}


