import styles from "./Registration.module.css";

const Registration = () => {
  return (
    <div className={styles.container}>
      <section className={styles.body}>
        <h2 className={styles.title}>Регистрация</h2>
        <form>
        <input type="text" className={styles.input}/>
        <input type="text" className={styles.input}/>
        <div className={styles.item}>
          <a className={styles.forgetPassword}>Забыли пароль?</a>
          <button className={styles.entryBtn}>Войти</button>
        </div>
        </form>
      </section>
    </div>
  );
};
export default Registration;
