import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLogin } from "../../store/store";
import Registration from "../Registration/Registration";
import type { Response } from "../../helpers/types/types";
import type { AxiosError } from "axios";
import axios from "axios";

function MainPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["verifyUser"],
    queryFn: async () => {
      const response: Response = await axios.get("http://localhost:3000/auth/refresh");
      const data = response.data;
      localStorage.setItem("token", data.token);
      return data;
    },
    retry: (count: number, error: AxiosError<{message: string}>) => {
      if(error.response?.data.message === 'Пользователь не авторизован') {
        return false;
      } else {
        return count < 2;
      }
    }
  });
  const login = useLogin((state) => state.setData);
  useEffect(() => {
    if (data) {
      login(data.email, data.password);
    }
  }, [data]);
  if (isLoading) {
    return <>{isLoading && <div>Идет загрузка...</div>}</>;
  }
  return (
    <>
      <Registration/>
    </>
  );
}

export default MainPage;
