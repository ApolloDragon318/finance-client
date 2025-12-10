import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
	const token = localStorage.getItem('token')
	const userJson = localStorage.getItem('user')
	if (!token || !userJson) {
		return <Navigate to="/login" replace />
	}
	return children
}


