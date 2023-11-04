import styles from './Footer.module.css';
import gitHubImg from '../../img/bxl-github.svg';

function Footer() {

    return (
        <div className={styles.view}>
            <div className={styles.bigContainer}>
                <div className={styles.textos}>
                    <h1>MyCountryApp</h1>
                    <p className={styles.comentario}>Proyecto Individual en <a href="https://www.soyhenry.com/" target="_blank" rel="noreferrer">Henry</a></p>
                    <p className={styles.parrafo}>Aplicación diseñada y desarrollada con las herramientas y el conocimiento adquirido en el bootcamp Desarrollo Fullstack en <a href="https://www.soyhenry.com/" target="_blank" rel="noreferrer">Henry</a>, usando tecnologías como React, Redux, Express, Node js, entre otras.</p>
                    <ol>
                        <li>Busca y selecciona un país</li>
                        <li>Personaliza tu búsqueda usando los filtros</li>
                        <li>Revisa las actividades turísticas de cada país</li>
                        <li>Crea y agrega nuevas actividades</li>
                    </ol>
                </div>
                <div className={styles.contacto}>
                    <a href="https://github.com/lucabruzzone" target="_blank" rel="noreferrer">
                        <img src={gitHubImg} alt="" />
                    </a>
                    <a href="https://github.com/lucabruzzone" target="_blank" rel="noreferrer">
                        <p>@lucabruzzone</p>
                    </a>
                </div>
                <div>
                    <p className={styles.year}>2023</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;