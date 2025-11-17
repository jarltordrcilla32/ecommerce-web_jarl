import { createContext, useContext, useState, useEffect } from 'react'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showSuccess = (message) => {
    setToastMessage({ type: 'success', message })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const showError = (message) => {
    setToastMessage({ type: 'error', message })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const showInfo = (message) => {
    setToastMessage({ type: 'info', message })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('http://localhost:5177/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.isRead).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5177/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5177/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every 5 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const value = {
    notifications,
    unreadCount,
    showSuccess,
    showError,
    showInfo,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className={`max-w-sm px-4 py-3 rounded-xl shadow-2xl backdrop-blur-sm border text-white transform transition-all duration-300 hover:scale-105 ${
            toastMessage.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400/20' 
              : toastMessage.type === 'error' 
              ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-400/20'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400/20'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                toastMessage.type === 'success' ? 'bg-emerald-400' :
                toastMessage.type === 'error' ? 'bg-red-400' :
                'bg-blue-400'
              }`}>
                {toastMessage.type === 'success' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {toastMessage.type === 'error' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                {toastMessage.type === 'info' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-5 text-white">
                  {toastMessage.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  )
}