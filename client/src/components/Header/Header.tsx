import { classNames } from "@/helpers/classNames/classNames";
import styles from "./Header.module.css";
import { Link } from "react-router";

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <section className={classNames(styles.body, ['container'])}>
        <Link to="/register" className={styles.link}>Регистрация</Link>
        <Link to="/login" className={styles.link}>Войти</Link>
      </section>
    </div>
  );
};

export default Header;
