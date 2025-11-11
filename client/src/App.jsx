import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900">
          <Outlet />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
