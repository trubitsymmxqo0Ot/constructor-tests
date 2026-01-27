import "./App.css";
import "./varibales.css";
import Header from "./components/Header/Header";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import MainPage from "./pages/MainPage/MainPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <MainPage/>
    </QueryClientProvider>
  );
}

export default App;
