import { useState, type InputHTMLAttributes } from "react";
import hidePasswordImage from "root/public/hidePassword.png";
import showPasswordImage from "root/public/showPassword.png";
import styles from "./input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  type: string;
  isPassword?: boolean;
}

const Input = (props: InputProps) => {
  const { placeholder, type, isPassword, ...otherProps } =
    props;
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisible = () => {
    setShowPassword(!showPassword);
  };
  if (isPassword) {
    return (
      <div className={styles.body}>
        <input
          type={showPassword ? "type" : "password"}
          placeholder={placeholder}
          {...otherProps}
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
    );
  }
  return <input type={type} placeholder={placeholder} {...otherProps} />;
};

export default Input;
