import Modal from './Modal'
import Spinner from './Spinner'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-slate-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="btn-danger flex items-center gap-2" onClick={onConfirm} disabled={loading}>
          {loading && <Spinner size="sm" />}
          Confirmar
        </button>
      </div>
    </Modal>
  )
}
