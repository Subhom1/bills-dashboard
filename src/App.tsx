import "./App.css";
import { Layout } from "./components/layout/_layout_";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Layout />
    </ErrorBoundary>
  );
}

export default App;
