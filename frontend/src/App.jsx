import { Frame } from "./components/Frame/Frame";
import logo from "./logo.svg";
import "./Normalize.css";
import { Home } from "./pages/Home/Home";

function App() {
  return (
    <div className="App">
      {/* Frame added for draggable area. Is transparent. Home is main part of app. */}
      <Frame />
      <Home />
    </div>
  );
}

export default App;
