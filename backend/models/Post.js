const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://rvrsbczzadgcfmuftesd.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnNiY3p6YWRnY2ZtdWZ0ZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTA4MTQsImV4cCI6MjA2OTMyNjgxNH0.ss1494060IuHo0roddrPgO7vug5TmL8IWfi4_l4nxWI'
);

class Post {
  constructor(data) {
    this.id = data.id;
    this.author = data.author;
    this.title = data.title;
    this.content = data.content;
    this.category = data.category;
    this.tags = data.tags || [];
    this.media = data.media || {};
    this.failureDetails = data.failureDetails || {};
    this.collaboration = data.collaboration || {};
    this.privacy = data.privacy || {};
    this.isAnonymous = data.isAnonymous || false;
    this.engagement = data.engagement || {
      likes: [],
      comments: [],
      shares: 0,
      bookmarks: 0
    };
    this.status = data.status || 'Active';
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error finding post:', error);
        return null;
      }

      return data ? new Post(data) : null;
    } catch (error) {
      console.error('Error in findById:', error);
      return null;
    }
  }

  static async find(filter = {}) {
    try {
      let query = supabase.from('posts').select('*');
      
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.category) {
        query = query.eq('category', filter.category);
      }
      if (filter.author) {
        query = query.eq('author', filter.author);
      }
      if (filter.search) {
        query = query.or(`title.ilike.%${filter.search}%,content.ilike.%${filter.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error finding posts:', error);
        return [];
      }

      return data ? data.map(post => new Post(post)) : [];
    } catch (error) {
      console.error('Error in find:', error);
      return [];
    }
  }

  async save() {
    try {
      const postData = {
        author: this.author,
        title: this.title,
        content: this.content,
        category: this.category,
        tags: this.tags,
        media: this.media,
        failureDetails: this.failureDetails,
        collaboration: this.collaboration,
        privacy: this.privacy,
        isAnonymous: this.isAnonymous,
        engagement: this.engagement,
        status: this.status
      };

      if (this.id) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', this.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating post:', error);
          throw error;
        }

        return new Post(data);
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert(postData)
          .select()
          .single();

        if (error) {
          console.error('Error creating post:', error);
          throw error;
        }

        return new Post(data);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  }

  async addLike(userId) {
    try {
      if (!this.engagement.likes.includes(userId)) {
        this.engagement.likes.push(userId);
        await this.save();
      }
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  }

  async removeLike(userId) {
    try {
      this.engagement.likes = this.engagement.likes.filter(id => id !== userId);
      await this.save();
    } catch (error) {
      console.error('Error removing like:', error);
      throw error;
    }
  }

  async addComment(userId, content, isAnonymous = false) {
    try {
      const comment = {
        id: Date.now().toString(),
        user: userId,
        content,
        isAnonymous,
        timestamp: new Date().toISOString()
      };

      this.engagement.comments.push(comment);
      await this.save();
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async populate(field) {
    // For now, return the post as is
    // In a full implementation, you would populate related data
    return this;
  }
}

module.exports = Post; 