import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import { DraggableList } from "./components/Draggable";

function App() {
  return (
    <div className="App">
      <DraggableList />
    </div>
  );
}

export default App;
