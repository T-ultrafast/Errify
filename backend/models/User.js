const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://rvrsbczzadgcfmuftesd.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnNiY3p6YWRnY2ZtdWZ0ZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTA4MTQsImV4cCI6MjA2OTMyNjgxNH0.ss1494060IuHo0roddrPgO7vug5TmL8IWfi4_l4nxWI'
);

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.institution = data.institution;
    this.bio = data.bio;
    this.avatarUrl = data.avatar_url;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error finding user:', error);
        return null;
      }

      return data ? new User(data) : null;
    } catch (error) {
      console.error('Error in findById:', error);
      return null;
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error finding user by email:', error);
        return null;
      }

      return data ? new User(data) : null;
    } catch (error) {
      console.error('Error in findByEmail:', error);
      return null;
    }
  }

  async save() {
    try {
      const userData = {
        id: this.id,
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        institution: this.institution,
        bio: this.bio,
        avatar_url: this.avatarUrl
      };

      if (this.id) {
        // Update existing user
        const { data, error } = await supabase
          .from('profiles')
          .update(userData)
          .eq('id', this.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating user:', error);
          throw error;
        }

        return new User(data);
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('profiles')
          .insert(userData)
          .select()
          .single();

        if (error) {
          console.error('Error creating user:', error);
          throw error;
        }

        return new User(data);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async updateStats(type) {
    // For now, just return success
    // In a full implementation, you would update user statistics
    return Promise.resolve();
  }
}

module.exports = User; 