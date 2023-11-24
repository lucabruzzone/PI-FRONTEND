import styles from './MainTransition.module.css';

function MainPageTransition() {
    return (
        <div className={styles.mainView}>
            <div className={styles.transition1}>
                <div className={styles.columns}></div>
                <div className={styles.columns}></div>
                <div className={styles.columns}></div>
                <div className={styles.columns}></div>
                <div className={styles.columns}></div>
            </div>
            <div className={styles.transition2}>
                <div className={styles.columns2}></div>
                <div className={styles.columns2}></div>
                <div className={styles.columns2}></div>
                <div className={styles.columns2}></div>
                <div className={styles.columns2}></div>
            </div>
        </div>
    )
}

export default MainPageTransition;
