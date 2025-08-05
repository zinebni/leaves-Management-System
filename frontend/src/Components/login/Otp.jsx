import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import WebSiteName from '../WebSiteName';
import { useNavigate, useParams } from 'react-router-dom';

export default function Otp() {
  const {role} = useParams();
  const {t} = useTranslation();
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ''); // Only digits
    // '/\D/' to replace the first non digital by '' so if we have no digital element it will be empty string
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (index < 5 && value) {
      inputRefs.current[index + 1].focus();
      //puts the cursor inside that next input field, so the user can continue typing without clicking.
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if(e.key === 'Enter'){
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join('');
    if (finalOtp.length === 6) {
      setError('');
    

      try {
        const res = await axios.post('http://localhost:4000/api/auth/verify-account', {otp: finalOtp}, {
          withCredentials: true
        });
        const orgID = res.data.data.orgID;
        const employeeId = res.data.data.employee._id;

        if(role === 'RH'){
          navigate(`/HR/${orgID}/${employeeId}`);
        } else {
          navigate(`/Employee/${orgID}/${employeeId}`);
        }
        
      } catch (error) {
        console.error("verify failed:", error?.response?.data || error.message);
        setError(t('otp.invalid'))
      }
    } else {
      setError(t('otp.error'));
    }
  };

  const handlePaste = (e) => {
    // Empêche le comportement par défaut du collage
    e.preventDefault();

    // Récupère les données collées et supprime tout caractère non numérique
    const pasteData = e.clipboardData.getData('Text').replace(/\D/g, '');

    // Vérifie si exactement 6 chiffres sont collés
    if (pasteData.length === 6) {
      // Transforme la chaîne en tableau de chiffres
      const newOtp = pasteData.split('');

      // Met à jour l'état OTP avec les nouveaux chiffres
      setOtp(newOtp);

      // Déplace le focus sur le dernier champ pour signaler que le collage est terminé
      setTimeout(() => {
        inputRefs.current[5]?.focus(); // ? permet d’éviter une erreur si l’élément n’existe pas encore
      }, 0);
    }
  };




   useEffect(() => {
    if(!vantaEffect){
      setVantaEffect(
        NET({
          el: vantaRef.current,   // the element to attach the animation to
          THREE: THREE,           // Passes the Three.js libary to Vanta
          color: 0x2c3e50,         // Deep urban blue for lines
          backgroundColor: 0xecf0f1, // Light gray background (like concrete)
          points: 15.0,            // How many points are generated.
          maxDistance: 28.0,       // Lines max length
          spacing: 22.0,           // Distance between points
          showDots: true,          //  Whether to display the dots/nodes.
          mouseControls: true,     // Interactive with mouse
          touchControls: true,      // Interactive with touch
          gyroControls: false,      // Don’t move the background when the user tilts the phone.
          minHeight: 200.0,
          minWidth: 200.0, 

        })
      )
    }
  },[]);


  return (
    <div ref={vantaRef}
        className='w-full h-screen overflow-hidden relative '
    >
      <div className="px-5 sm:px-10 py-5 flex justify-between items-center">
        <WebSiteName />
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col items-center mt-20 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-10">{t('otp.enter')}</h2>
      <div className="flex gap-2 mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            ref={(el) => (inputRefs.current[i] = el)}
            className="w-12 h-12 text-center text-xl border-2 border-gray-700 rounded bg-gray-100"
          />
        ))}
      </div>
      <p className='text-red-600 text-lg mb-5'>
        {error}
      </p>
      <button
        className="bg-mediumBlue text-lg text-white px-4 py-2 rounded
                    cursor-pointer hover:bg-darkBlue"
        
        onClick={handleSubmit}
      >
        {t('otp.verify')}
      </button>
    </div>
    </div>
  )
}