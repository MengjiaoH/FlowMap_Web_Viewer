import './App.css';
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css"
import MainViewLayout from "./Views/MainViewLayout";

function App() {
  return (
    <div className="App">
      <MainViewLayout/>
    </div>
  );
}

export default App;
