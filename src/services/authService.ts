import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  planType: string;
}

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
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
      throw new Error(error.message);
    }

    // Create user profile
    if (data.user) {
      await this.createUserProfile(data.user.id, email, fullName);
    }

    return data;
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name || undefined,
      avatarUrl: user.user_metadata?.avatar_url || undefined,
      planType: 'free'
    };
  }

  // Create user profile
  private async createUserProfile(userId: string, email: string, fullName?: string) {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        plan_type: 'free'
      });

    if (error) {
      console.error('Error creating user profile:', error);
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

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = await this.getCurrentUser();
        callback(authUser);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();