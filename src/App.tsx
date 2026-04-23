import { Routes, Route } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home/Home';
import { SignIn } from './pages/Auth/SignIn';
import { SignUp } from './pages/Auth/SignUp';
import { Transactions } from './pages/Transactions/Transactions';
import { Profile } from './pages/Profile/Profile';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Common/ProtectedRoute';
import { GuestRoute } from './components/Common/GuestRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route element={<GuestRoute />}>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
