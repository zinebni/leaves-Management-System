import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function WebSiteName() {

  const navigate = useNavigate();

  const moveToHome = async () => {
    try{
      const res = await api.post('/api/auth/logout', {});
      //Pour get on ne met pas {} car il n'attend pas de body mais pour put , post il faut {}
    } catch(error){
      console.log('Failed to logout : ' + error.message);
    }
    navigate('/');
  }

  return (
    <div className='font-bold text-2xl sm:text-3xl text-mediumBlue dark:text-blue-500  cursor-pointer'
        onClick={moveToHome}
    >
      RHPlus
    </div>
  )
}
