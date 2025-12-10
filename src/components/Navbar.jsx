import { Link, useNavigate } from 'react-router-dom'
import { Squares2X2Icon, Cog6ToothIcon, ArrowRightOnRectangleIcon, UserCircleIcon, BuildingLibraryIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
	const navigate = useNavigate()
	const userJson = localStorage.getItem('user')
	const user = userJson ? JSON.parse(userJson) : null

	function logout() {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		navigate('/login')
	}

	return (
		<nav className="sticky top-0 z-40 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow">
			<div className="container flex items-center gap-4 py-3">
				<Link to="/" className="flex items-center gap-2 font-semibold">
					<Squares2X2Icon className="h-5 w-5" />
					<span>Finance</span>
				</Link>
				{user?.role === 'admin' && <Link className="hover:opacity-90" to="/admin">Admin</Link>}
				{user?.role === 'admin' && <Link className="hover:opacity-90 flex items-center gap-1" to="/projects"><BuildingLibraryIcon className="h-5 w-5" />Projects</Link>}
				{user?.role === 'admin' && <Link className="hover:opacity-90 flex items-center gap-1" to="/invoices"><DocumentTextIcon className="h-5 w-5" />Invoices</Link>}
				{user && <Link className="hover:opacity-90 flex items-center gap-1" to="/settings"><Cog6ToothIcon className="h-5 w-5" />Settings</Link>}
				<div className="ml-auto">
				{user ? (
					<>
						<span className="mr-3 inline-flex items-center gap-1"><UserCircleIcon className="h-5 w-5" />{user.name} ({user.role})</span>
						<button className="btn-secondary bg-white/10 text-white hover:bg-white/20 border-0" onClick={logout}><ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />Logout</button>
					</>
				) : (
					<Link className="btn-secondary bg-white/10 text-white hover:bg-white/20 border-0" to="/login">Login</Link>
				)}
				</div>
			</div>
		</nav>
	)
}


