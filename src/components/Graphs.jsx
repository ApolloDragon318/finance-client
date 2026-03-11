import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

function fmtTotal(v) {
	const n = Number(v)
	return n < 0 ? `($${Math.abs(n).toLocaleString()})` : `$${n.toLocaleString()}`
}

export default function Graphs({ stats }) {
	if (!stats) return null
	const palette = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#06b6d4', '#a855f7', '#84cc16', '#f43f5e', '#0ea5e9']

	function renderMultiLine(block, title, xKey) {
		if (!block || !block.buckets || !block.lines) return null
		// Transform to recharts-friendly rows
		const rows = block.buckets.map((label, i) => {
			const row = { [xKey]: label }
			for (const line of block.lines) {
				row[line.name] = line.values[i] || 0
			}
			return row
		})
		return (
			<div>
				<h3>{title}</h3>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={rows}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey={xKey} />
						<YAxis />
						<Tooltip />
						<Legend />
						{block.lines.map((line, idx) => (
							<Line key={line.id} type="monotone" dataKey={line.name} stroke={palette[idx % palette.length]} dot={false} />
						))}
					</LineChart>
				</ResponsiveContainer>
			</div>
		)
	}
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
			{/* Per-period distribution: X = users, Y = income */}
			{Array.isArray(stats?.byUsers?.week) && (
				<div>
					<h3>This Week — Total by User</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={stats.byUsers.week}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip formatter={(v) => [fmtTotal(v), 'Total']} />
							<Bar dataKey="total" fill="#6366f1" name="Total" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
			{Array.isArray(stats?.byUsers?.month) && (
				<div>
					<h3>This Month — Total by User</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={stats.byUsers.month}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip formatter={(v) => [fmtTotal(v), 'Total']} />
							<Bar dataKey="total" fill="#22c55e" name="Total" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
			{Array.isArray(stats?.byUsers?.quarter) && (
				<div>
					<h3>This Quarter — Total by User</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={stats.byUsers.quarter}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip formatter={(v) => [fmtTotal(v), 'Total']} />
							<Bar dataKey="total" fill="#8b5cf6" name="Total" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
			{Array.isArray(stats?.byUsers?.year) && (
				<div>
					<h3>This Year — Total by User</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={stats.byUsers.year}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip formatter={(v) => [fmtTotal(v), 'Total']} />
							<Bar dataKey="total" fill="#f59e0b" name="Total" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
			{Array.isArray(stats?.byUsers?.overall) && (
				<div>
					<h3>Overall — Total by User</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={stats.byUsers.overall}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip formatter={(v) => [fmtTotal(v), 'Total']} />
							<Bar dataKey="total" fill="#06b6d4" name="Total" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
			<div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
				<h3>Total</h3>
				<p style={{ fontSize: 24, margin: 0, color: Number(stats.overallTotal) < 0 ? '#dc2626' : undefined }}>
					{fmtTotal(stats.overallTotal)}
				</p>
			</div>
		</div>
	)
}


