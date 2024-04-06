import "./App.css";
import Dashboard from "./pages/dashboard";
import Loader from "./components/loader";

function App() {
  return (
    <div className="App">
      <Loader />
      <Dashboard />
    </div>
  );
}

export default App;
