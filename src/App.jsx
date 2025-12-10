import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Projects from './pages/Projects'
import Invoices from './pages/Invoices'
import Settings from './pages/Settings'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'

export default function App() {
	return (
		<div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial' }}>
			<Navbar />
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route
					path="/signup"
					element={<ProtectedRoute><AdminRoute><Signup /></AdminRoute></ProtectedRoute>}
				/>
				<Route
					path="/"
					element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}
				/>
				<Route
					path="/admin"
					element={<ProtectedRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>}
				/>
				<Route
					path="/projects"
					element={<ProtectedRoute><AdminRoute><Projects /></AdminRoute></ProtectedRoute>}
				/>
				<Route
					path="/invoices"
					element={<ProtectedRoute><AdminRoute><Invoices /></AdminRoute></ProtectedRoute>}
				/>
				<Route
					path="/settings"
					element={<ProtectedRoute><Settings /></ProtectedRoute>}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</div>
	)
}


