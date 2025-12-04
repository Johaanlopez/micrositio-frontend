import React, { useEffect, useRef, useState, useCallback } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

type Post = {
  id: number | string;
  title: string;
  content: string;
  excerpt?: string;
  date?: string;
};

const PAGE_SIZE = 10;

const ContentViewer: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/content/posts?page=${p}&limit=${PAGE_SIZE}`, { withCredentials: true });
      const data: { items: Post[]; total?: number } = res.data;
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Invalid response');
      }
      setPosts((prev) => [...prev, ...data.items]);
      if (data.items.length < PAGE_SIZE) setHasMore(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        // Unauthorized: redirect to login
        navigate('/login');
        return;
      }
      // Si falla, mostrar mensaje pero no bloquear el dashboard
      console.warn('No se pudieron cargar posts:', err?.response?.data?.message || err.message);
      setError('No hay contenido disponible por el momento.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // initial load
    fetchPage(1);
  }, [fetchPage]);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((p) => p + 1);
      }
    }, { rootMargin: '200px' });
    obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [loading, hasMore]);

  useEffect(() => {
    if (page === 1) return;
    fetchPage(page);
  }, [page, fetchPage]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header del Dashboard */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido a tu panel de control
        </p>
      </div>

      {/* Mensaje de bienvenida grande si no hay posts */}
      {!loading && posts.length === 0 && !error && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-12 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-bold mb-4">¡Bienvenido! 🎉</h2>
                <p className="text-2xl text-blue-100 mb-2">
                  Has iniciado sesión exitosamente
                </p>
                <p className="text-lg text-blue-200">
                  🔐 Sistema protegido con autenticación de dos factores
                </p>
              </div>
              <div className="hidden lg:block text-9xl opacity-20">
                🚀
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de estadísticas/cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Usuario Activo
            </h3>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Verificado
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cuenta activa con 2FA habilitado
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Seguridad
            </h3>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Máxima
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Autenticación de dos factores activa
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Publicaciones
            </h3>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {posts.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Contenidos disponibles
          </p>
        </div>
      </div>

      {/* Lista de posts */}
      {posts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Publicaciones Recientes
          </h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {post.title}
                </h3>
                <div className="text-base text-gray-600 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: post.excerpt || post.content }} />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    📅 {post.date ? new Date(post.date).toLocaleDateString('es-ES') : 'Sin fecha'}
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Leer más →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje de información si no hay contenido */}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-lg p-6 shadow-md">
          <div className="flex items-start">
            <div className="text-3xl mr-4">ℹ️</div>
            <div>
              <p className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Información
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mb-3">
                {error}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                El contenido se cargará automáticamente cuando esté disponible.
              </p>
            </div>
          </div>
        </div>
      )}

      <div ref={observerRef} className="h-6" />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            ✨ Has visto todas las publicaciones
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentViewer;
