import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { socketService } from '../../services/socketService';
import styles from './FloatingQueryBar.module.css';

/**
 * FloatingQueryBar — a fixed bottom bar on the dashboard that allows users
 * to ask follow-up questions to the agent.
 */
export default function FloatingQueryBar() {
  const [query, setQuery] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!query.trim() || isSending) return;

    setIsSending(true);
    socketService.sendQuery(query, { source: 'dashboard' });

    // Simulate short delay for UI feedback
    setTimeout(() => {
      setQuery('');
      setIsSending(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={styles.queryBarContainer}>
      <Sparkles size={18} color="var(--color-accent)" />
      <input
        className={styles.queryInput}
        placeholder="Ask the AI to generate a new chart..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
      />
      <button 
        className={styles.sendBtn} 
        onClick={handleSend}
        disabled={!query.trim() || isSending}
        aria-label="Send Query"
      >
        <Send size={16} className={styles.sendIcon} />
      </button>
    </div>
  );
}
