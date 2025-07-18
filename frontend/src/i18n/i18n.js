import i18n from 'i18next'; //import the i18n engine
import  {initReactI18next} from 'react-i18next'; // to link react with the i18n engine

import fr from './locals/fr.json';
import en from './locals/en.json';

//initialize the i18n and link it to react 

i18n.use(initReactI18next).init({
  resources: {
    fr: {translation: fr},
    en: {translation: en}
  },
  lng: localStorage.getItem('i18nextLng') || 'fr', // default language , use localstorage so all page take the language from the localstorge because it can be render before the configuration of i18n finish
  fallbackLng: 'fr', //fallback if translation key missing for example we don't have the key 'login' in the english file so we will use the frensh version
  interpolation: {
    escapeValue: false, //to escape variable inside values in the translation files like {{name}}
  }
});

export default i18n;