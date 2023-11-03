import styles from './Loading.module.css';

function Loading() {
    return (
        <div id={styles.mainVew}>
            <div id={styles.loading}></div>
        </div>
    );
}

export default Loading;