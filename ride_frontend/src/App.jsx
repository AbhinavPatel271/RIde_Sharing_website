import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { AuthProvider } from "./authContext";
import ProtectedRoute from "./protectedRoute";

import Home from "./components/pages/home";
import AddRide from "./components/pages/addRide";
import Login from "./components/pages/loginPage";
import RequestTabs from "./components/pages/requests";
import PendingRides from "./components/pages/pendingRides";
import CompletedRides from "./components/pages/completedRides";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/addRide",
    element: (
      <ProtectedRoute>
        <AddRide />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests",
    element: (
      <ProtectedRoute>
        <RequestTabs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pendingRides",
    element: (
      <ProtectedRoute>
        <PendingRides />
      </ProtectedRoute>
    ),
  },
  {
    path: "/completedRides",
    element: (
      <ProtectedRoute>
        <CompletedRides />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
