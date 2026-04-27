import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownWidget.module.css';

/**
 * MarkdownWidget — Rich markdown renderer with GFM support.
 * Renders agent-generated reports, summaries, and documentation.
 */
export default function MarkdownWidget({ data, vizConfig = {} }) {
  const content = typeof data === 'string' ? data : vizConfig.content || '';

  if (!content) {
    return <div>No content provided</div>;
  }

  return (
    <div className={styles.markdownBody}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
