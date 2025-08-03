import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rvrsbczzadgcfmuftesd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY environment variable is not set!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, profileData) => {
    try {
      console.log('Supabase: Attempting signup for email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      console.log('Supabase: Signup result:', { data: data?.user?.id, error });
      
      if (error) throw error
      
      // If signup successful, create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: profileData.full_name,
              institution: profileData.institution,
              field_of_study: profileData.field_of_study,
              bio: profileData.bio || '',
            }
          ])
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
          // You might want to handle this error appropriately
        }
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      console.log('Supabase: Attempting signin for email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log('Supabase: Signin result:', { data: data?.user?.id, error });
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      return { user: null, error }
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Profile helper functions
export const profiles = {
  // Get user profile
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
      
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Create user profile
  createProfile: async (profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
      
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export default supabase 