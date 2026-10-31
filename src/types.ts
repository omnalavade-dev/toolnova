export type ToolCategory = 'pdf' | 'image' | 'calc' | 'ai';

export interface ToolItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  categoryLabel: string;
  icon: string;
  badge?: 'Popular' | 'New' | 'Featured' | 'Essential';
  tags: string[];
  route: string;
  featured?: boolean;
  popular?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  summary: string;
  content: string[];
  relatedToolIds: string[];
  keyTakeaways: string[];
}
