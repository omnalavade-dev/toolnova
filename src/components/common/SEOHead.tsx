import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: 'website' | 'article' | 'tool';
  schemaData?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  type = 'website',
  schemaData
}) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title.includes('ToolNova') ? title : `${title} | ToolNova`;
    document.title = fullTitle;

    // 2. Helper to set or create meta
    const setMeta = (nameAttr: 'name' | 'property', attrValue: string, contentValue: string) => {
      let tag = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(nameAttr, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', contentValue);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type === 'article' ? 'article' : 'website');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    // 3. Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const fullUrl = `https://toolnova.app${canonicalPath}`;
    canonical.setAttribute('href', fullUrl);

    // 4. Update JSON-LD structured data
    let scriptTag = document.getElementById('jsonld-seo');
    if (schemaData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'jsonld-seo';
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalPath, type, schemaData]);

  return null;
};
