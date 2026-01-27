import Form from "./Form/Form";
import styles from "./Registration.module.css";

const Registration = () => {

  return (
    <div className={styles.container}>
      <section className={styles.body}>
        <h2 className={styles.title}>Регистрация</h2>
        <Form/>
      </section>
    </div>
  );
};
export default Registration;
