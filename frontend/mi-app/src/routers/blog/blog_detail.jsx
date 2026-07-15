import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ContextJsonLoadContext } from '../../context/context_json_load/context_json_load_context';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Share2, 
  Heart, 
  BookOpen,
  MapPin,
  Sprout,
  Droplets,
  Sun,
  ChevronRight
} from 'lucide-react';
import SEOHelmet from '../../components/seo/SEOHelmet/SEOHelmet';
import './blog_detail.scss';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { blogs } = useContext(ContextJsonLoadContext);
    
    const [blogPost, setBlogPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [readingTime, setReadingTime] = useState(0);
    const [activeSection, setActiveSection] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    useEffect(() => {
        if (location.state?.blogData && location.state.blogData.id === id) {
            setBlogPost(location.state.blogData);
            setIsLoading(false);
        } else if (blogs?.blogs) {
            const foundBlog = blogs.blogs.find(blog => blog.id === id);
            if (foundBlog) {
                setBlogPost(foundBlog);
            } else {
                if (import.meta.env.DEV) console.error('No se encontró el artículo solicitado.');
                setTimeout(() => {
                    navigate('/blog', { replace: true });
                }, 2000);
            }
            setIsLoading(false);
        }
    }, [id, blogs, location.state, navigate]);

    useEffect(() => {
        if (blogPost?.content) {
            const wordsPerMinute = 200;
            let totalWords = 0;
            
            if (blogPost.content.introduction) {
                totalWords += blogPost.content.introduction.split(' ').length;
            }
            
            if (blogPost.content.sections) {
                blogPost.content.sections.forEach(section => {
                    totalWords += (section.text || '').split(' ').length;
                    totalWords += (section.heading || '').split(' ').length;
                    if (section.list) {
                        section.list.forEach(item => {
                            totalWords += item.split(' ').length;
                        });
                    }
                });
            }
            
            if (blogPost.content.conclusion) {
                totalWords += blogPost.content.conclusion.split(' ').length;
            }
            
            setReadingTime(Math.ceil(totalWords / wordsPerMinute));
        }
    }, [blogPost]);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('.content-section');
            const scrollPosition = window.scrollY + 200;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    setActiveSection(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blogPost.title,
                    text: blogPost.subtitle || blogPost.content?.introduction,
                    url: window.location.href,
                });
            } catch (error) {
                if (import.meta.env.DEV && error?.name !== 'AbortError') {
                    console.error('No se pudo compartir el artículo.');
                }
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('¡Enlace copiado al portapapeles!');
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        localStorage.setItem(`blog-like-${id}`, (!isLiked).toString());
    };

    useEffect(() => {
        const liked = localStorage.getItem(`blog-like-${id}`) === 'true';
        setIsLiked(liked);
    }, [id]);

    const handleImageError = (imageKey) => {
        setImageErrors(prev => ({ ...prev, [imageKey]: true }));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const scrollToSection = (index) => {
        const sections = document.querySelectorAll('.content-section');
        if (sections[index]) {
            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isLoading) {
        return (
            <div className="blog-detail__loading">
                <div className="loading-container">
                    <Sprout className="loading-icon" size={48} />
                    <p>Cargando artículo...</p>
                </div>
            </div>
        );
    }

    if (!blogPost) {
        return (
            <div className="blog-detail__error">
                <h2>Artículo no encontrado</h2>
                <p>Redirigiendo a la lista de blogs...</p>
            </div>
        );
    }

    const isAgricultureCategory = blogPost.category === 'Agricultura';

    return (
        <div className="blog-detail">
            <SEOHelmet 
                title={blogPost.title} 
                description={blogPost.subtitle || blogPost.content?.introduction} 
                keywords={blogPost.category} 
                author={blogPost.author || 'Neyen Frandino'} 
                url={window.location.href} 
                image={blogPost.card?.image} 
            />

            {/* Hero Section */}
            <div className="blog-detail__hero" 
                 style={{
                     backgroundImage: blogPost.card?.image ? `url(${blogPost.card.image})` : 'none'
                 }}>
                <div className="hero-pattern"></div>
                <div className="hero-overlay"></div>
                
                {/* Navigation Bar */}
                <div className="blog-detail__nav">
                    {/* <button onClick={handleGoBack} className="nav-back">
                        <ArrowLeft size={20} />
                        <span>Volver al Blog</span>
                    </button> */}
                    
                    <div className="nav-actions">
                        <button onClick={handleShare} className="action-btn" aria-label="Compartir">
                            <Share2 size={20} />
                        </button>
                        <button 
                            onClick={handleLike} 
                            className={`action-btn ${isLiked ? 'liked' : ''}`}
                            aria-label="Me gusta"
                        >
                            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>
                
                {/* Hero Content */}
                <div className="hero-content">
                    {blogPost.category && (
                        <div className="hero-category-wrapper">
                            <span className="hero-category">
                                {isAgricultureCategory ? <Sprout size={16} /> : <Tag size={16} />}
                                {blogPost.category}
                            </span>
                        </div>
                    )}
                    
                    <h1 className="hero-title">{blogPost.title}</h1>
                    
                    {blogPost.subtitle && (
                        <p className="hero-subtitle">{blogPost.subtitle}</p>
                    )}
                    
                    <div className="hero-meta">
                        {blogPost.date && (
                            <span className="meta-item">
                                <Calendar size={16} />
                                {formatDate(blogPost.date)}
                            </span>
                        )}
                        
                        {blogPost.author && (
                            <span className="meta-item">
                                <User size={16} />
                                {blogPost.author}
                            </span>
                        )}
                        
                        <span className="meta-item">
                            <Clock size={16} />
                            {readingTime} min de lectura
                        </span>

                        {isAgricultureCategory && (
                            <span className="meta-item">
                                <MapPin size={16} />
                                Misiones, Argentina
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <article className="blog-detail__content">
                <div className="content-container">
                    <div className="content-wrapper">
                        {/* Introduction */}
                        {blogPost.content?.introduction && (
                            <div className="content-introduction">
                                <div className="intro-icon">
                                    <BookOpen size={20} />
                                </div>
                                <p>{blogPost.content.introduction}</p>
                            </div>
                        )}
                        
                        {/* Content Sections */}
                        {blogPost.content?.sections && blogPost.content.sections.map((section, index) => (
                            <section key={index} className="content-section">
                                {section.heading && (
                                    <h2 className="section-heading">
                                        <span className="heading-number">{String(index + 1).padStart(2, '0')}</span>
                                        {section.heading}
                                    </h2>
                                )}
                                
                                {/* Section Image */}
                                {section.image && !imageErrors[`section-${index}`] && (
                                    <div className="section-image-container">
                                        <img 
                                            src={section.image}
                                            alt={section.heading || `Imagen de sección ${index + 1}`}
                                            className="section-image"
                                            onError={() => handleImageError(`section-${index}`)}
                                            loading="lazy"
                                        />
                                        {section.imageCaption && (
                                            <p className="image-caption">{section.imageCaption}</p>
                                        )}
                                    </div>
                                )}
                                
                                {section.text && (
                                    <div className="section-text">
                                        <p>{section.text}</p>
                                    </div>
                                )}
                                
                                {section.list && (
                                    <div className="section-list-container">
                                        <ul className="section-list">
                                            {section.list.map((item, idx) => (
                                                <li key={idx}>
                                                    <span className="list-icon">
                                                        <ChevronRight size={16} />
                                                    </span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {section.quote && (
                                    <blockquote className="section-quote">
                                        <p>{section.quote}</p>
                                        {section.quoteAuthor && (
                                            <cite>— {section.quoteAuthor}</cite>
                                        )}
                                    </blockquote>
                                )}
                            </section>
                        ))}
                        
                        {/* Conclusion */}
                        {blogPost.content?.conclusion && (
                            <div className="content-conclusion">
                                <h2>
                                    <Sun size={20} />
                                    Conclusión
                                </h2>
                                <p>{blogPost.content.conclusion}</p>
                            </div>
                        )}
                        
                        {/* Footer */}
                        <div className="content-footer">
                            <div className="footer-tags">
                                {blogPost.tags && blogPost.tags.map((tag, index) => (
                                    <span key={index} className="tag">#{tag}</span>
                                ))}
                            </div>
                            
                            <div className="footer-actions">
                                <button onClick={handleShare} className="share-btn">
                                    <Share2 size={18} />
                                    Compartir artículo
                                </button>
                                
                                <button 
                                    onClick={handleLike} 
                                    className={`like-btn ${isLiked ? 'liked' : ''}`}
                                >
                                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                                    {isLiked ? 'Te gusta' : 'Me gusta'}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar */}
                    <aside className="blog-detail__sidebar">
                        {/* Article Info Card */}
                        <div className="sidebar-card">
                            <h3>
                                <BookOpen size={18} />
                                Sobre este artículo
                            </h3>
                            <div className="sidebar-info">
                                <div className="info-item">
                                    <Tag size={14} />
                                    <span><strong>Categoría:</strong> {blogPost.category || 'General'}</span>
                                </div>
                                <div className="info-item">
                                    <Clock size={14} />
                                    <span><strong>Lectura:</strong> {readingTime} minutos</span>
                                </div>
                                <div className="info-item">
                                    <Calendar size={14} />
                                    <span><strong>Publicado:</strong> {blogPost.date ? formatDate(blogPost.date) : 'Sin fecha'}</span>
                                </div>
                                {blogPost.author && (
                                    <div className="info-item">
                                        <User size={14} />
                                        <span><strong>Autor:</strong> {blogPost.author}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table of Contents */}
                        {blogPost.content?.sections && blogPost.content.sections.length > 0 && (
                            <div className="sidebar-card toc-card">
                                <h3>Contenido</h3>
                                <nav className="table-of-contents">
                                    {blogPost.content.sections.map((section, index) => (
                                        section.heading && (
                                            <button
                                                key={index}
                                                className={`toc-item ${activeSection === index ? 'active' : ''}`}
                                                onClick={() => scrollToSection(index)}
                                            >
                                                <span className="toc-number">{String(index + 1).padStart(2, '0')}</span>
                                                <span className="toc-text">{section.heading}</span>
                                            </button>
                                        )
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Agriculture Tips Card */}
                        {isAgricultureCategory && (
                            <div className="sidebar-card tips-card">
                                <h3>
                                    <Droplets size={18} />
                                    Tips de Agricultura
                                </h3>
                                <ul className="tips-list">
                                    <li>Aprovecha la tierra roja misionera</li>
                                    <li>Mantén un buen drenaje</li>
                                    <li>Usa materia orgánica regularmente</li>
                                    <li>Controla la humedad del suelo</li>
                                </ul>
                            </div>
                        )}
                        
                        {/* Related Links */}
                        {blogPost.relatedLinks && (
                            <div className="sidebar-card">
                                <h3>Enlaces relacionados</h3>
                                <ul className="related-links">
                                    {blogPost.relatedLinks.map((link, index) => (
                                        <li key={index}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                <ChevronRight size={14} />
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </aside>
                </div>
            </article>
        </div>
    );
};

export default BlogDetail;
