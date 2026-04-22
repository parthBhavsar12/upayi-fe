import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home/Home';
import { SignIn } from './pages/Auth/SignIn';
import { SignUp } from './pages/Auth/SignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
