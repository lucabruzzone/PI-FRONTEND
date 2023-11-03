import './App.css';
import styles from './App.module.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HOME, FORM, DETAIL, URL, COUNTRIES, SUCCESSFORM } from './utils/pathroutes';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import Home from './components/home/Home';
import Form from './components/form/Form';
import Detail from './components/detail/Detail';
import NavBar from './components/navBar/NavBar';
import Footer from './components/Footer/Footer';
import SuccessForm from './components/form/SuccessForm';
import { actionInitialCountries } from './redux/actions';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  async function getInitialCountries() {
    try {
      const { data } = await axios(`${URL}/${COUNTRIES}`);
      if (data.length) {
        dispatch(actionInitialCountries(data));
      }
      else throw Error('La carga de los países no fue exitosa');
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getInitialCountries();
  }, []);

  return (
    <div className='App' id={styles.mainView}>
      {location.pathname !== '/' && <NavBar />}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path={HOME} element={<Home />} />
        <Route path={FORM} element={<Form />} />
        <Route path={`${DETAIL}/:id`} element={<Detail />} />
        <Route path={SUCCESSFORM} element={<SuccessForm />} />
      </Routes>
      {(location.pathname !== '/' && location.pathname !== SUCCESSFORM && location.pathname !== FORM) && <Footer />}
    </div>
  )
}

export default App
