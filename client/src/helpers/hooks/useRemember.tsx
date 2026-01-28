import { useEffect, useState } from "react";
import { useLogin } from "@/store/store";

export const useRemember = (data?: {
  email: string;
  password: string;
  token: string;
}) => {
  const userInfo = useLogin((state) => state.setData);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (data) {
      userInfo(data.email, data.password);
    }
  }, [data]);
  return { userData, setUserData };
};
