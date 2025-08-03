import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket && this.isConnected) {
      return;
    }

    this.socket = io('http://localhost:5001', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    // Set up global event listeners
    this.setupGlobalListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  setupGlobalListeners() {
    // Listen for new posts
    this.socket.on('new_post', (data) => {
      console.log('New post received:', data);
      toast.success('New research post available!');
      this.notifyListeners('new_post', data);
    });

    // Listen for post updates
    this.socket.on('post_updated', (data) => {
      console.log('Post updated:', data);
      this.notifyListeners('post_updated', data);
    });

    // Listen for post deletions
    this.socket.on('post_deleted', (data) => {
      console.log('Post deleted:', data);
      this.notifyListeners('post_deleted', data);
    });

    // Listen for new comments
    this.socket.on('new_comment', (data) => {
      console.log('New comment received:', data);
      toast.success('New comment added!');
      this.notifyListeners('new_comment', data);
    });

    // Listen for post likes
    this.socket.on('post_liked', (data) => {
      console.log('Post liked:', data);
      this.notifyListeners('post_liked', data);
    });

    // Listen for post unlikes
    this.socket.on('post_unliked', (data) => {
      console.log('Post unliked:', data);
      this.notifyListeners('post_unliked', data);
    });
  }

  // Join a specific post room to receive updates
  joinPost(postId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_post', postId);
    }
  }

  // Leave a specific post room
  leavePost(postId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_post', postId);
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify all listeners for an event
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in socket listener:', error);
        }
      });
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 