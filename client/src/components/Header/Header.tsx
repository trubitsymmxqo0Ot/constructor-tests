import { classNames } from "../../helpers/classNames/classNames";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <section className={classNames(styles.body, ['container'])}>
        <button className={styles.btn}>Регистрация</button>
        <button className={styles.btn}>Войти</button>
      </section>
    </div>
  );
};

export default Header;
