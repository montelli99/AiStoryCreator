'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  autoConnect?: boolean
  roomId?: string
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const { autoConnect = true, roomId } = options

    if (autoConnect) {
      const socketInstance = io({
        path: '/api/socket',
        addTrailingSlash: false,
      })

      socketRef.current = socketInstance
      setSocket(socketInstance)

      socketInstance.on('connect', () => {
        console.log('Connected to WebSocket server')
        setIsConnected(true)
        
        // Join room if provided
        if (roomId) {
          socketInstance.emit('join-room', roomId)
        }
      })

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from WebSocket server')
        setIsConnected(false)
      })

      // Clean up on unmount
      return () => {
        socketInstance.disconnect()
      }
    }
  }, [options.autoConnect, options.roomId])

  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  const joinRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', roomId)
    }
  }

  return {
    isConnected,
    socket,
    emit,
    on,
    off,
    joinRoom,
  }
}

// Specific hooks for different real-time events
export const useJobUpdates = (callback: (data: any) => void) => {
  const { on, off } = useSocket({ autoConnect: true })

  useEffect(() => {
    on('job-status-changed', callback)
    return () => {
      off('job-status-changed', callback)
    }
  }, [on, off, callback])
}

export const useDirectorUpdates = (callback: (data: any) => void) => {
  const { on, off } = useSocket({ autoConnect: true })

  useEffect(() => {
    on('director-updated', callback)
    return () => {
      off('director-updated', callback)
    }
  }, [on, off, callback])
}

export const useContentUpdates = (callback: (data: any) => void) => {
  const { on, off } = useSocket({ autoConnect: true })

  useEffect(() => {
    on('new-content', callback)
    return () => {
      off('new-content', callback)
    }
  }, [on, off, callback])
}

export const useCharacterUpdates = (callback: (data: any) => void) => {
  const { on, off } = useSocket({ autoConnect: true })

  useEffect(() => {
    on('character-changed', callback)
    return () => {
      off('character-changed', callback)
    }
  }, [on, off, callback])
}

export const useAnalyticsUpdates = (callback: (data: any) => void) => {
  const { on, off } = useSocket({ autoConnect: true })

  useEffect(() => {
    on('analytics-refresh', callback)
    return () => {
      off('analytics-refresh', callback)
    }
  }, [on, off, callback])
}