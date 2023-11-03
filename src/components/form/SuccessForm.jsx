import styles from './SuccessForm.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOME } from '../../utils/pathroutes';


function SuccessForm() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate(HOME);
        }, 3000);
    }, []);

    return (
        <div className={styles.mainView}>
            <p>Actividad creada con éxito!</p>
        </div>
    );
}

export default SuccessForm;