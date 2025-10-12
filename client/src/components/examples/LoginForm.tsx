import LoginForm from '../LoginForm';

export default function LoginFormExample() {
  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Login successful:', credentials);
  };

  const handleBack = () => {
    console.log('Back clicked');
  };

  return <LoginForm role="student" onLogin={handleLogin} onBack={handleBack} />;
}
