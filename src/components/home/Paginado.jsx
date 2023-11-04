import styles from './Paginado.module.css';
import PropTypes from 'prop-types';
import leftImg from '../../img/circle-left-regular.svg';
import rightImg from '../../img/circle-right-regular.svg';
import { useSelector, useDispatch } from 'react-redux';
import { actionSetPage } from '../../redux/actions';

function Paginado({ totalPages }) {
    Paginado.propTypes = {
        totalPages: PropTypes.number.isRequired,
    };
    const dispatch = useDispatch()
    const page = useSelector(state => state.page);

    function handleNextPage() {
        if (page < totalPages) {
            dispatch(actionSetPage(page + 1));
        }
    }

    function handlePrevPage() {
        if (page > 1) {
            dispatch(actionSetPage(page - 1));
        }
    }

    return (
        <div className={styles.mainView}>
            <img onClick={handlePrevPage} id={styles.arrows} className={styles.leftArrow} src={leftImg} alt="" />
            <div className={styles.pagesBox}>
                <div className={styles.pagesSubBox}>
                    <input value={page} type="text" readOnly max={totalPages} min='0' />
                    <p>de {totalPages}</p>
                </div>
            </div>
            <img onClick={handleNextPage} id={styles.arrows} className={styles.rightArrow} src={rightImg} alt="" />
        </div>
    );
}

export default Paginado;