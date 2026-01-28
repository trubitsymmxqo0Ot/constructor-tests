import "./App.css";
import "./varibales.css";
import Header from "./components/Header/Header";
import { useQuery } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import { AxiosError } from "axios";
import { useLogin } from "./store/store";
import { useEffect } from "react";
import type { Response } from "./helpers/types/types";
import $axios from "./helpers/instanse/axios";

function App() {
  const { data } = useQuery({
    queryKey: ["verifyUser"],
    queryFn: async () => {
      const response: Response = await $axios.get(
        "http://localhost:3000/auth/refresh",
      );
      const data = response.data;
      localStorage.setItem("token", data.token);
      return data;
    },
    retry: (count: number, error: AxiosError<{ message: string }>) => {
      if (error.response?.data.message === "Пользователь не авторизован") {
        return false;
      } else {
        return count < 2;
      }
    },
  });
  const login = useLogin((state) => state.setData);
  useEffect(() => {
    if (data) {
      login(data.email, data.password);
    }
  }, [data]);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
