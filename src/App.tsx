import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './features/onboarding/pages/LandingPage';
import { RegisterPage } from './features/onboarding/pages/RegisterPage';
import { LoginPage } from './features/onboarding/pages/LoginPage';
import { EmailSentPage } from './features/onboarding/pages/EmailSentPage';
import { EmailVerifiedPage } from './features/onboarding/pages/EmailVerifiedPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/verify-email" element={<EmailVerifiedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
