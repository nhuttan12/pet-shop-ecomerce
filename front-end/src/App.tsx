import Routes from "./router.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
    // <Routes />
    // <h1 className="text-3xl font-bold underline">Hello world!</h1>
  );
}

export default App;
