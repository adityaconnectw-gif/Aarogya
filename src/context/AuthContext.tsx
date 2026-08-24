import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEMO_USERS: Record<UserRole, AuthUser> = {
  patient: {
    id: 'usr-pat-001',
    name: 'Aditya Verma',
    email: 'aditya@demo.health',
    role: 'patient',
    patientId: 'P-10001',
  },
  doctor: {
    id: 'usr-doc-001',
    name: 'Dr. Rohan Sharma',
    email: 'doctor@demo.health',
    role: 'doctor',
    doctorId: 'DOC-301',
    hospitalId: 'hosp-001',
    hospitalName: 'City Care Hospital',
  },
  admin: {
    id: 'usr-adm-001',
    name: 'Hospital Administration',
    email: 'admin@demo.health',
    role: 'admin',
    hospitalId: 'hosp-001',
    hospitalName: 'City Care Hospital (Admin Portal)',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('aarogyam_auth_user');
      return saved ? JSON.parse(saved) : DEMO_USERS.patient; // default to patient for instant demo exploration
    } catch {
      return DEMO_USERS.patient;
    }
  });

  const role: UserRole = user ? user.role : 'patient';
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem('aarogyam_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aarogyam_auth_user');
    }
  }, [user]);

  const login = (emailOrPhone: string, requestedRole: UserRole): boolean => {
    const demo = DEMO_USERS[requestedRole];
    setUser({
      ...demo,
      email: emailOrPhone.includes('@') ? emailOrPhone : demo.email,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setUser(DEMO_USERS[newRole]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
