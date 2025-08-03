const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://rvrsbczzadgcfmuftesd.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnNiY3p6YWRnY2ZtdWZ0ZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTA4MTQsImV4cCI6MjA2OTMyNjgxNH0.ss1494060IuHo0roddrPgO7vug5TmL8IWfi4_l4nxWI'
);

class Patent {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.abstract = data.abstract;
    this.inventors = data.inventors || [];
    this.assignee = data.assignee;
    this.patentNumber = data.patent_number;
    this.filingDate = data.filing_date;
    this.publicationDate = data.publication_date;
    this.status = data.status || 'Active';
    this.claims = data.claims || [];
    this.description = data.description;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('patents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error finding patent:', error);
        return null;
      }

      return data ? new Patent(data) : null;
    } catch (error) {
      console.error('Error in findById:', error);
      return null;
    }
  }

  static async find(filter = {}) {
    try {
      let query = supabase.from('patents').select('*');
      
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.assignee) {
        query = query.eq('assignee', filter.assignee);
      }
      if (filter.search) {
        query = query.or(`title.ilike.%${filter.search}%,abstract.ilike.%${filter.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error finding patents:', error);
        return [];
      }

      return data ? data.map(patent => new Patent(patent)) : [];
    } catch (error) {
      console.error('Error in find:', error);
      return [];
    }
  }

  async save() {
    try {
      const patentData = {
        title: this.title,
        abstract: this.abstract,
        inventors: this.inventors,
        assignee: this.assignee,
        patent_number: this.patentNumber,
        filing_date: this.filingDate,
        publication_date: this.publicationDate,
        status: this.status,
        claims: this.claims,
        description: this.description
      };

      if (this.id) {
        // Update existing patent
        const { data, error } = await supabase
          .from('patents')
          .update(patentData)
          .eq('id', this.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating patent:', error);
          throw error;
        }

        return new Patent(data);
      } else {
        // Create new patent
        const { data, error } = await supabase
          .from('patents')
          .insert(patentData)
          .select()
          .single();

        if (error) {
          console.error('Error creating patent:', error);
          throw error;
        }

        return new Patent(data);
      }
    } catch (error) {
      console.error('Error saving patent:', error);
      throw error;
    }
  }

  async populate(field) {
    // For now, return the patent as is
    // In a full implementation, you would populate related data
    return this;
  }
}

module.exports = Patent; 