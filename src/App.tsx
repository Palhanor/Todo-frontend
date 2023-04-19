import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./screens/landingpage";
import Login from "./screens/login";
import Register from "./screens/register";
import Home from "./screens/home";
import User from "./screens/user";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/user",
    element: <User />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
