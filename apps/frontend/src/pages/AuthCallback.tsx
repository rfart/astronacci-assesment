import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const linked = searchParams.get('linked');
    
    if (token) {
      login(token);
      // Redirect to articles page after successful OAuth authentication
      // Show a brief message if account was linked
      if (linked === 'true') {
        // You could show a toast notification here if you have a toast system
        console.log('Google account successfully linked to your existing account');
      }
      navigate('/articles', { replace: true });
    } else {
      // Handle error case
      console.error('Authentication failed: No token received');
      navigate('/login', { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          height: '128px',
          width: '128px',
          borderBottom: '2px solid #2563eb',
          margin: '0 auto'
        }}></div>
        <p style={{ 
          marginTop: '16px', 
          fontSize: '18px', 
          color: '#6b7280' 
        }}>Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
