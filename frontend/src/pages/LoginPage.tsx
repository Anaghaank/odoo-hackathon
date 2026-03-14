import React from 'react';
import AuthSidebar from '../components/AuthSidebar';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  const logoUrl = '/HeroLogo.webp';

  return (
    <div className="flex min-h-screen font-sans antialiased text-slate-900 h-screen overflow-hidden">
      <AuthSidebar />
      <AuthForm />
    </div>
  );
};

export default LoginPage;
