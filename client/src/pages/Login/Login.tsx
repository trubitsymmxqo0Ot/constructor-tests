import Input from "@/components/Input/Input";
import styles from "./Login.module.css";
import { useMutation } from "@tanstack/react-query";
import $axios from "@/helpers/instanse/axios";
import type { IData, Response } from "@/helpers/types/types";
import { useRemember } from "@/helpers/hooks/useRemember";

const Login = () => {
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
      localStorage.setItem('token', data.token);
      return data;
    },
  });
  const { userData, setUserData } = useRemember(data);
  const toggleButton = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ path: "/login", req: userData });
  };
  return (
    <div className={styles.container}>
      <form className={styles.wrapper}>
        <h2 className={styles.title}>Вход</h2>
        <div className={styles.body}>
          <Input
            type="text"
            maxLength={58}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            value={userData.email}
            placeholder="Введите email"
            className={styles.email}
          />
          <Input
            type="password"
            isPassword={true}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            maxLength={32}
            placeholder="Введите пароль"
            value={userData.password}
          />
        </div>
        <div className={styles.item}>
          <a href="#" className={styles.forgetPassword}>Забыли пароль?</a>
          <button className={styles.entryBtn} onClick={toggleButton}>
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
