export default function Modal({ open, title, onClose, children }) {
	if (!open) return null
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button className="btn-secondary px-3 py-1" onClick={onClose}>Close</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	)
}




