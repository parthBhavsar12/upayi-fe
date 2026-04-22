import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header/Header';

export function MainLayout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
