import React, { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import api from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import ContentErrorBoundary from './ContentErrorBoundary';

type Props = {
  postId?: number;
  slug?: string;
  className?: string;
};

type Post = {
  id?: number | string;
  title: string;
  content: string;
  excerpt?: string;
  date?: string;
  slug?: string;
};

const SANITIZE_OPTIONS: DOMPurify.Config = {
  USE_PROFILES: { html: true },
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'width', 'height', 'target', 'rel', 'loading'],
};

const WordPressContent: React.FC<Props> = ({ postId, slug, className }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const fetchContent = async () => {
      if (!slug && !postId) {
        setError('missing-identifier');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const endpoint = slug ? `/api/content/page/${encodeURIComponent(slug)}` : `/api/content/posts/${postId}`;
        const res = await api.get(endpoint, { withCredentials: true });
        if (!active) return;
        const data = res.data as Post;
        if (!data || !data.content) {
          setError('not-found');
          return;
        }
        setPost(data);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          navigate('/login');
          return;
        }
        if (status === 404) setError('not-found'); else setError(err?.response?.data?.message || err.message || 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    return () => { active = false; };
  }, [slug, postId, navigate]);

  const sanitized = useMemo(() => {
    if (!post) return '';
    // use DOMPurify to sanitize WP HTML before injecting
    try {
      // cast SANITIZE_OPTIONS to any to avoid mismatched DOMPurify type differences across versions
      return DOMPurify.sanitize(post.content, SANITIZE_OPTIONS as any);
    } catch (e) {
      return '';
    }
  }, [post]);

  if (loading) {
    return (
      <div className={`animate-pulse space-y-4 ${className || ''}`}>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
    );
  }

  if (error === 'not-found') {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 border rounded">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Contenido no encontrado</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">La página solicitada no existe.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 border rounded">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Error</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <ContentErrorBoundary fallback={<div className="p-6">No se puede mostrar el contenido.</div>}>
      <article className={`prose max-w-none dark:prose-invert wp-content ${className || ''}`}>
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="px-2">/</span>
          <Link to="/dashboard/posts" className="hover:underline">Posts</Link>
          {post && (
            <>
              <span className="px-2">/</span>
              <span className="text-gray-700 dark:text-gray-200">{post.title}</span>
            </>
          )}
        </nav>

        {post && (
          <header className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{post.title}</h1>
            {post.date && <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleString()}</div>}
          </header>
        )}

        <div dangerouslySetInnerHTML={{ __html: sanitized }} />
      </article>
    </ContentErrorBoundary>
  );
};

export default WordPressContent;
