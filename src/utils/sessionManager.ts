/**
 * Session Manager for Smart Ledger
 * Handles automatic session timeout and activity tracking
 */

// Session timeout duration (30 minutes of inactivity)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export class SessionManager {
  private lastActivityTime: number;
  private timeoutId: NodeJS.Timeout | null = null;
  private onSessionExpired: (() => void) | null = null;

  constructor() {
    this.lastActivityTime = Date.now();
  }

  /**
   * Initialize session tracking
   */
  start(onExpired: () => void) {
    this.onSessionExpired = onExpired;
    this.resetTimeout();
    this.setupActivityListeners();
  }

  /**
   * Stop session tracking and cleanup
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.removeActivityListeners();
  }

  /**
   * Reset the inactivity timer
   */
  private resetTimeout() {
    // Clear existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set new timeout
    this.timeoutId = setTimeout(() => {
      if (this.onSessionExpired) {
        this.onSessionExpired();
      }
    }, SESSION_TIMEOUT);

    this.lastActivityTime = Date.now();
  }

  /**
   * Track user activity
   */
  private trackActivity = () => {
    this.resetTimeout();
  };

  /**
   * Setup event listeners for user activity
   */
  private setupActivityListeners() {
    // Track various user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, this.trackActivity, { passive: true });
    });
  }

  /**
   * Remove activity listeners
   */
  private removeActivityListeners() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.removeEventListener(event, this.trackActivity);
    });
  }

  /**
   * Get time remaining until session expires (in milliseconds)
   */
  getTimeRemaining(): number {
    const elapsed = Date.now() - this.lastActivityTime;
    return Math.max(0, SESSION_TIMEOUT - elapsed);
  }

  /**
   * Check if session is still active
   */
  isActive(): boolean {
    return this.getTimeRemaining() > 0;
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
