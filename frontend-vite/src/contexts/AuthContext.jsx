import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Direct profile fetch function with timeout and better error handling
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      console.log('AuthContext: No user ID provided for profile fetch');
      setProfile(null);
      setProfileLoading(false);
      return null;
    }
    
    try {
      setProfileLoading(true);
      console.log('AuthContext: Starting profile fetch for user:', userId);
      
      // Set a timeout for the entire operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 15000); // 15 second timeout
      });
      
      const fetchPromise = async () => {
        // First, verify the current session to ensure we're fetching for the right user
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user) {
          console.log('AuthContext: No active session found during profile fetch');
          throw new Error('No active session');
        }
        
        if (currentSession.user.id !== userId) {
          console.error('AuthContext: User ID mismatch during profile fetch:', {
            requestedUserId: userId,
            currentUserId: currentSession.user.id
          });
          throw new Error('User ID mismatch');
        }
        
        // Try to fetch profile with all possible field names
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('AuthContext: Error fetching profile:', error);
          
          // If profile doesn't exist, create a basic one
          if (error.code === 'PGRST116') {
            console.log('AuthContext: Profile not found, creating basic profile');
            const basicProfile = {
              id: userId,
              first_name: currentSession.user.email?.split('@')[0] || 'User',
              last_name: '',
              email: currentSession.user.email,
              institution: '',
              field: '',
              linkedin: '',
              researchgate: '',
              orcid: '',
              bio: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([basicProfile])
              .select()
              .single();
            
            if (createError) {
              console.error('AuthContext: Error creating basic profile:', createError);
              throw createError;
            }
            
            console.log('AuthContext: Basic profile created successfully:', newProfile);
            return newProfile;
          }
          
          throw error;
        }
        
        // Validate the fetched profile
        if (!data || data.id !== userId) {
          console.error('AuthContext: Profile validation failed - ID mismatch:', {
            profileId: data?.id,
            userId: userId
          });
          throw new Error('Profile validation failed');
        }
        
        console.log('AuthContext: Profile fetched and validated successfully:', {
          profileId: data.id,
          profileName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          userId: userId,
          profileData: data
        });
        
        return data;
      };
      
      // Race between timeout and fetch
      const data = await Promise.race([fetchPromise(), timeoutPromise]);
      
      // Immediately set the profile state
      setProfile(data);
      setProfileLoading(false);
      console.log('AuthContext: Profile state updated successfully');
      return data;
      
    } catch (error) {
      console.error('AuthContext: Error in fetchProfile:', error);
      setProfile(null);
      setProfileLoading(false);
      
      // If it's a timeout or network error, try a simpler approach
      if (error.message === 'Profile fetch timeout' || error.message.includes('network')) {
        console.log('AuthContext: Trying simplified profile fetch...');
        try {
          const { data, error: simpleError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          
          if (!simpleError && data && data.id === userId) {
            console.log('AuthContext: Simplified fetch successful:', data);
            setProfile(data);
            setProfileLoading(false);
            return data;
          }
        } catch (simpleError) {
          console.error('AuthContext: Simplified fetch also failed:', simpleError);
        }
      }
      
      return null;
    }
  }, []);

  // Simplified auth state handler with aggressive profile loading
  const handleAuthChange = useCallback(async (event, session) => {
    console.log('AuthContext: Auth state changed:', event, session?.user?.id);
    
    setSession(session);
    
    if (session?.user) {
      setUser(session.user);
      
      // Clear any existing profile first to prevent stale data
      setProfile(null);
      
      // Immediately start profile fetch
      console.log('AuthContext: Starting immediate profile fetch for user:', session.user.id);
      fetchProfile(session.user.id).catch(error => {
        console.error('AuthContext: Initial profile fetch failed:', error);
        // Don't let this break the auth flow
      });
    } else {
      // Clear all user data on logout
      setUser(null);
      setProfile(null);
      console.log('AuthContext: User logged out, cleared all data');
    }
    
    setLoading(false);
    setAuthLoading(false);
    setInitialized(true);
  }, [fetchProfile]);

  // Initialize auth with aggressive profile handling
  useEffect(() => {
    console.log('AuthContext: Initializing...');
    
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('AuthContext: Initial session:', initialSession?.user?.id);
        
        if (!mounted) return;
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Clear any existing profile first
          setProfile(null);
          
          // Immediately start profile fetch
          console.log('AuthContext: Starting initial profile fetch for user:', initialSession.user.id);
          fetchProfile(initialSession.user.id).catch(error => {
            console.error('AuthContext: Initial profile fetch failed:', error);
            // Don't let this break the auth flow
          });
        } else {
          console.log('AuthContext: No initial session found');
        }
      } catch (error) {
        console.error('AuthContext: Error initializing:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    
    initAuth();

    // More aggressive fallback timeout
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.log('AuthContext: Timeout - forcing initialization');
        setLoading(false);
        setInitialized(true);
        setProfileLoading(false);
      }
    }, 3000); // Reduced to 3 seconds

    return () => {
      mounted = false;
      subscription?.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [handleAuthChange, loading]);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      console.log('AuthContext: Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log('AuthContext: Login successful for:', email);
      return { success: true, data };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email, password, profileData) => {
    setAuthLoading(true);
    try {
      console.log('AuthContext: Register attempt for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        try {
          console.log('AuthContext: Creating profile for user:', data.user.id);
          
          // Wait a moment for the database trigger to potentially create the profile
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if profile already exists (created by trigger)
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (checkError && checkError.code !== 'PGRST116') {
            console.error('AuthContext: Error checking existing profile:', checkError);
            throw checkError;
          }
          
          // If profile doesn't exist, create it manually
          if (!existingProfile) {
            console.log('AuthContext: No profile found, creating manually');
            
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  first_name: profileData.first_name || profileData.full_name?.split(' ')[0] || email.split('@')[0],
                  last_name: profileData.last_name || profileData.full_name?.split(' ').slice(1).join(' ') || '',
                  email: email,
                  institution: profileData.institution || '',
                  field: profileData.field_of_study || profileData.field || '',
                  linkedin: profileData.linkedin || '',
                  researchgate: profileData.researchgate || '',
                  orcid: profileData.orcid || '',
                  bio: profileData.bio || '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);
            
            if (profileError) {
              console.error('AuthContext: Error creating profile:', profileError);
              throw profileError;
            }
            
            console.log('AuthContext: Profile created successfully for user:', data.user.id);
          } else {
            console.log('AuthContext: Profile already exists for user:', data.user.id);
          }
        } catch (profileError) {
          console.error('AuthContext: Error handling profile creation:', profileError);
          // Don't throw here - the user account was created successfully
          // Just log the error for debugging
        }
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('AuthContext: Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      console.log('AuthContext: Logout initiated');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setAuthLoading(true);
    try {
      console.log('AuthContext: Password reset requested for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      console.log('AuthContext: Password reset email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Password reset error:', error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      console.log('AuthContext: Updating profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select();
      
      if (error) throw error;
      
      setProfile(data[0]);
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshProfile = async () => {
    if (!user?.id) {
      console.log('AuthContext: Cannot refresh profile - no user logged in');
      return { success: false, error: 'No user logged in' };
    }

    try {
      console.log('AuthContext: Refreshing profile for user:', user.id);
      setProfileLoading(true);
      
      // First verify the current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession?.user) {
        console.error('AuthContext: No active session during profile refresh');
        return { success: false, error: 'No active session' };
      }
      
      if (currentSession.user.id !== user.id) {
        console.error('AuthContext: User ID mismatch during profile refresh:', {
          currentUserId: user.id,
          sessionUserId: currentSession.user.id
        });
        return { success: false, error: 'User ID mismatch' };
      }
      
      const profileData = await fetchProfile(user.id);
      
      if (profileData && profileData.id === user.id) {
        console.log('AuthContext: Profile refreshed successfully:', {
          profileId: profileData.id,
          profileName: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          userId: user.id
        });
        setProfile(profileData);
        return { success: true, data: profileData };
      } else {
        console.log('AuthContext: No valid profile found during refresh for user:', user.id);
        setProfile(null);
        return { success: false, error: 'Profile not found' };
      }
    } catch (error) {
      console.error('AuthContext: Error refreshing profile:', error);
      return { success: false, error: error.message };
    } finally {
      setProfileLoading(false);
    }
  };

  // Aggressive profile load with multiple retry attempts
  const forceProfileLoad = async () => {
    if (!user?.id) {
      console.log('AuthContext: Cannot force profile load - no user logged in');
      return { success: false, error: 'No user logged in' };
    }

    console.log('AuthContext: Force loading profile for user:', user.id);
    
    // Clear existing profile first
    setProfile(null);
    setProfileLoading(true);
    
    // Try multiple approaches
    const attempts = [
      // Attempt 1: Full validation approach
      async () => {
        console.log('AuthContext: Force load attempt 1 - full validation');
        return await fetchProfile(user.id);
      },
      // Attempt 2: Simple direct fetch
      async () => {
        console.log('AuthContext: Force load attempt 2 - simple fetch');
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        if (!data || data.id !== user.id) throw new Error('Profile validation failed');
        
        setProfile(data);
        setProfileLoading(false);
        return data;
      },
      // Attempt 3: Raw query without validation
      async () => {
        console.log('AuthContext: Force load attempt 3 - raw query');
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error('No profile found');
        
        setProfile(data);
        setProfileLoading(false);
        return data;
      }
    ];
    
    for (let i = 0; i < attempts.length; i++) {
      try {
        const result = await attempts[i]();
        if (result) {
          console.log('AuthContext: Force load successful on attempt', i + 1);
          return { success: true, data: result };
        }
      } catch (error) {
        console.error(`AuthContext: Force load attempt ${i + 1} failed:`, error);
        if (i === attempts.length - 1) {
          // Last attempt failed
          setProfile(null);
          setProfileLoading(false);
          return { success: false, error: error.message };
        }
      }
    }
    
    return { success: false, error: 'All attempts failed' };
  };

  // Manual trigger for immediate profile fetch
  const triggerProfileFetch = async () => {
    if (!user?.id) {
      console.log('AuthContext: Cannot trigger profile fetch - no user logged in');
      return { success: false, error: 'No user logged in' };
    }

    console.log('AuthContext: Manual trigger for profile fetch for user:', user.id);
    
    // Clear existing profile and loading state
    setProfile(null);
    setProfileLoading(true);
    
    try {
      const result = await fetchProfile(user.id);
      return { success: !!result, data: result };
    } catch (error) {
      console.error('AuthContext: Manual trigger failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Database check function to debug profile issues
  const checkProfileInDatabase = async () => {
    if (!user?.id) {
      console.log('AuthContext: Cannot check database - no user logged in');
      return { success: false, error: 'No user logged in' };
    }

    console.log('AuthContext: Checking database for profile of user:', user.id);
    
    try {
      // Check if profiles table exists and has data
      const { data: allProfiles, error: listError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .limit(10);
      
      if (listError) {
        console.error('AuthContext: Error listing profiles:', listError);
        return { success: false, error: listError.message };
      }
      
      console.log('AuthContext: All profiles in database:', allProfiles);
      
      // Check specific user profile
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.error('AuthContext: Error fetching user profile:', userError);
        return { success: false, error: userError.message, allProfiles };
      }
      
      console.log('AuthContext: User profile found:', userProfile);
      return { success: true, data: userProfile, allProfiles };
      
    } catch (error) {
      console.error('AuthContext: Error checking database:', error);
      return { success: false, error: error.message };
    }
  };

  const forceStateReset = () => {
    console.log('AuthContext: Force state reset called');
    setLoading(false);
    setInitialized(true);
    setAuthLoading(false);
    setProfileLoading(false);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    profileLoading,
    authLoading,
    initialized,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    refreshProfile,
    forceProfileLoad,
    triggerProfileFetch,
    checkProfileInDatabase,
    forceStateReset,
    isAuthenticated: !!user && !!session,
  };

  // Debug logging
  useEffect(() => {
    console.log('AuthContext: State update', {
      user: user?.id,
      session: !!session,
      profile: profile ? {
        id: profile.id,
        full_name: profile.full_name,
        matches_user: profile.id === user?.id
      } : null,
      loading,
      initialized,
      isAuthenticated: !!user && !!session
    });
  }, [user, session, profile, loading, initialized]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 