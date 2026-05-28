import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-surface-bg text-text-primary antialiased">
      <Outlet />
    </div>
  );
}

export default App;
