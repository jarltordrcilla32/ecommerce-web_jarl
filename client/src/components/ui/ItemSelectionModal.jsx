import { useState } from 'react'

function ItemSelectionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  order 
}) {
  const [selectedItems, setSelectedItems] = useState([])
  const [cancellationReason, setCancellationReason] = useState('')

  const handleItemToggle = (itemIndex) => {
    setSelectedItems(prev => 
      prev.includes(itemIndex) 
        ? prev.filter(index => index !== itemIndex)
        : [...prev, itemIndex]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === order.items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(order.items.map((_, index) => index))
    }
  }

  const handleConfirm = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to cancel')
      return
    }
    onConfirm(selectedItems, cancellationReason)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen || !order) return null

  const totalSelectedPrice = selectedItems.reduce((sum, index) => {
    const item = order.items[index]
    return sum + (item.price * item.quantity)
  }, 0)

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-2xl">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancel Items
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select which items you want to cancel from this order
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-4 space-y-6">
            {/* Select All */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === order.items.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  Select All Items
                </span>
              </label>
              <span className="text-sm text-gray-500">
                {selectedItems.length} of {order.items.length} selected
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(index)}
                    onChange={() => handleItemToggle(index)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">Qty {item.quantity} • {item.size}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-600">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Cancellation Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Change of mind, found better price, etc."
                rows={3}
              />
            </div>

            {/* Summary */}
            {selectedItems.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Items to cancel:</span>
                  <span className="font-semibold text-gray-900">{selectedItems.length} items</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Total refund:</span>
                  <span className="font-semibold text-red-600">₱{totalSelectedPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Selected Items
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemSelectionModal

