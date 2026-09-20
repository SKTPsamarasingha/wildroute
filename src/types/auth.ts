export type UserRole = 'superadmin' | 'admin' | 'staff' | 'customer';

export type PermissionKey =
  | 'all'
  | 'manage_products'
  | 'manage_tours'
  | 'manage_orders'
  | 'manage_users'
  | 'view_analytics'
  | 'manage_inventory';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions?: string[];
  photoURL?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayload {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  permissions?: string[];
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  updateRoleAndPermissions: (uid: string, role: UserRole, permissions: string[]) => Promise<void>;
}
