import { useEffect, useState } from "react";
import { useLogin } from "../../../store/store";
import { useMutation } from "@tanstack/react-query";
import $axios from "../../../helpers/instanse/axios";

import styles from './Form.module.css';
import type { IData, Response } from "../../../helpers/types/types";
import RegisterInputs from "../RegisterInputs/RegisterInputs";

const Form = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const toggleButton = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ path: "/register", req: userData });
  };
  const register = useLogin((state) => state.setData);
  const { mutate, data } = useMutation({
    mutationFn: async ({
      path,
      req,
    }: {
      path: string;
      req: Omit<IData, "token">;
    }) => {
      const response: Response = await $axios.post(path, req);
      const data = response.data;
      localStorage.setItem("token", data.token);
      return data;
    },
  });
  useEffect(() => {
    if (data) {
      register(data.email, data.password);
    }
  }, [data]);
  return (
    <form>
      <RegisterInputs userData={userData} setUserData={setUserData}/>
      <div className={styles.item}>
        <a className={styles.forgetPassword}>Забыли пароль?</a>
        <button className={styles.entryBtn} onClick={toggleButton}>
          Войти
        </button>
      </div>
    </form>
  );
};

export default Form;
