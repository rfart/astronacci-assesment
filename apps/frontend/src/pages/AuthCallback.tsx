import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      login(token);
      navigate('/', { replace: true });
    } else {
      // Handle error case
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
