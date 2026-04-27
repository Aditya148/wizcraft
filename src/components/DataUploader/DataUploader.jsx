import { useRef, useState } from 'react';
import { Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { socketService } from '../../services/socketService';
import styles from './DataUploader.module.css';

/**
 * DataUploader — Allows users to upload a CSV/JSON dataset.
 * Reads the file and emits a 'user:upload' event via the socket service
 * so the backend Agent Orchestrator can ingest it.
 */
export default function DataUploader() {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState(null); // 'uploading', 'success', null

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      
      // Emit the file to the agent gateway
      socketService.send('user:upload', {
        name: file.name,
        type: file.type,
        size: file.size,
        content: content
      });

      setStatus('success');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 3000);
    };

    reader.onerror = () => {
      console.error('Failed to read file');
      setStatus(null);
    };

    reader.readAsText(file);
  };

  return (
    <div className={styles.uploader}>
      <button 
        className={styles.uploadBtn} 
        onClick={() => fileInputRef.current?.click()}
        disabled={status === 'uploading'}
      >
        <Upload size={16} />
        Upload Dataset
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        className={styles.uploadInput}
        accept=".csv,.json"
        onChange={handleFileChange}
      />

      {status === 'uploading' && (
        <div className={styles.uploadStatus}>
          <Loader2 size={14} className="spin" />
          Processing dataset...
        </div>
      )}

      {status === 'success' && (
        <div className={`${styles.uploadStatus} ${styles.success}`}>
          <CheckCircle2 size={14} />
          Dataset sent to Agent successfully!
        </div>
      )}
    </div>
  );
}
