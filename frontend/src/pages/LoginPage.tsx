import React from 'react';
import AuthSidebar from '../components/AuthSidebar';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  // Using the generated logo path relative to public correctly would require moving it
  // For now, I'll use a placeholder or assume the logo is accessible
  const logoUrl = '/flowstock_logo.png'; 

  return (
    <div className="flex min-h-screen font-sans antialiased text-slate-900 h-screen overflow-hidden">
      <AuthSidebar logoUrl={logoUrl} />
      <AuthForm />
    </div>
  );
};

export default LoginPage;
