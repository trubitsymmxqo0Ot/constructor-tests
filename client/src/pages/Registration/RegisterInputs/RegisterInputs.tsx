import { useState } from "react";
import hidePasswordImage from "../../../../public/hidePassword.png";
import showPasswordImage from "../../../../public/showPassword.png";
import styles from "./RegisterInputs.module.css";
import type { IData } from "../../../helpers/types/types";

interface RegisterInputsProps {
  userData: IData;
  setUserData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
    }>
  >;
}

const RegisterInputs = ({ userData, setUserData }: RegisterInputsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisible = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <input
        type="text"
        className={styles.email}
        maxLength={58}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        value={userData.email}
        placeholder="Введите email"
      />
      <div className={styles.body}>
        <input
          type={showPassword ? "type" : "password"}
          className={styles.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          maxLength={32}
          placeholder="Введите пароль"
          value={userData.password}
        />
        {showPassword ? (
          <img
            src={hidePasswordImage}
            alt="Скрыть пароль"
            className={styles.passwordImage}
            onClick={togglePasswordVisible}
          />
        ) : (
          <img
            src={showPasswordImage}
            alt="Показать пароль"
            className={styles.passwordImage}
            onClick={togglePasswordVisible}
          />
        )}
      </div>
    </>
  );
};

export default RegisterInputs;
