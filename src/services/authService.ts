import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  planType: string;
  role?: string;
}

export const isAdminUser = (user?: AuthUser | null) => user?.role === 'admin';

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
    console.log('Auth Service: Attempting sign up for email:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      console.error('Auth Service: Sign up error:', error.message);
      throw error;
    }

    // Create user profile
    if (data.user) {
      await this.createUserProfile(data.user.id, email, fullName);
    }

    console.log('Auth Service: Sign up successful. User:', data.user?.id);
    return data;
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    console.log('Auth Service: Attempting sign in for email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Auth Service: Sign in error:', error.message);
      throw error;
    }

    // Ensure user profile exists in public.users table after successful sign-in
    if (data.user) {
      await this.createUserProfile(data.user.id, data.user.email!, data.user.user_metadata?.full_name);
    }

    console.log('Auth Service: Sign in successful. User:', data.user?.id);
    return data;
  }

  // Sign out
  async signOut() {
    console.log('Auth Service: Attempting sign out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Auth Service: Sign out error:', error.message);
      throw error;
    }
    console.log('Auth Service: Sign out successful.');
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    console.log('Auth Service: Fetching current user...');
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Auth Service: Error fetching current user:', error.message);
      return null;
    }
    console.log('Auth Service: Current user:', user?.id ? 'Logged In' : 'Logged Out', user?.id, 'Metadata:', user?.user_metadata);
    if (user) {
      return {
        id: user.id,
        email: user.email!,
        fullName: user.user_metadata?.full_name,
        avatarUrl: user.user_metadata?.avatar_url,
        planType: user.user_metadata?.plan_type || 'free',
        role: (user.app_metadata as any).role ?? 'user',
      };
    }
    return null;
  }

  // Create or update user profile in public.users table
  private async createUserProfile(userId: string, email: string, fullName?: string) {
    console.log('Auth Service: Creating/Updating user profile for ID:', userId);
    const { error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        plan_type: 'free' // Default plan type
      }, { onConflict: 'id' }); // Conflict on 'id' means update existing row

    if (error) {
      console.error('Auth Service: Error creating/updating user profile:', error);
    } else {
      console.log('Auth Service: User profile created/updated successfully.');
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<Pick<AuthUser, 'fullName' | 'avatarUrl'>>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { error } = await supabase
      .from('users')
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl
      })
      .eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // Delete user account
  async deleteAccount() {
    console.log('Auth Service: Attempting to delete account...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      // First, delete user data from related tables
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Auth Service: Error deleting user profile:', profileError);
      }

      // Delete user's soil analyses
      const { error: analysesError } = await supabase
        .from('soil_analyses')
        .delete()
        .eq('user_id', user.id);

      if (analysesError) {
        console.error('Auth Service: Error deleting user analyses:', analysesError);
      }

      // Delete user's ML predictions
      const { error: predictionsError } = await supabase
        .from('ml_predictions')
        .delete()
        .eq('user_id', user.id);

      if (predictionsError) {
        console.error('Auth Service: Error deleting user predictions:', predictionsError);
      }

      // Finally, delete the auth user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

      if (deleteError) {
        console.error('Auth Service: Error deleting auth user:', deleteError);
        throw deleteError;
      }

      console.log('Auth Service: Account deleted successfully');
    } catch (error) {
      console.error('Auth Service: Account deletion failed:', error);
      throw error;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    console.log('Auth Service: Initializing listener for auth state changes');
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth Service: Auth state changed!', { event, session });
      const supabaseUser = session ? session.user : null;
      if (supabaseUser) {
        const user: AuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          fullName: supabaseUser.user_metadata?.full_name,
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          planType: supabaseUser.user_metadata?.plan_type || 'free',
          role: (supabaseUser.app_metadata as any)?.role || 'user',
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  async getSession() {
    return await supabase.auth.getSession();
  }
}

export const authService = new AuthService();