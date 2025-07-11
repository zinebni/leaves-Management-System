import { useState } from 'react';
import { createPortal } from 'react-dom';
// createPortal lets you render an element directly into a different DOM node outside your React root hierarchy, so it’s not affected by parent styles like overflow: hidden. Then using position: fixed and z-50 (or any high z-index) ensures your element appears visually on top of everything else.
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [openList, setOpenList] = useState(false);

  const Dropdown = (
    <ul className="fixed top-14 right-5 bg-white border rounded shadow-md  z-50">
      <li
        onClick={() => {
          i18n.changeLanguage('fr');
          setOpenList(false);
        }}
        className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${
          i18n.language === 'fr' ? 'font-semibold' : ''
        }`}
      >
        Français
      </li>
      <li
        onClick={() => {
          i18n.changeLanguage('en');
          setOpenList(false);
        }}
        className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${
          i18n.language === 'en' ? 'font-semibold' : ''
        }`}
      >
        English
      </li>
    </ul>
  );

  return (
    <div className="relative z-50">
      <div
        className="cursor-pointer p-1"
        onClick={() => setOpenList(prev => !prev)}
      >
        <Globe className="w-5 h-5" />
      </div>

      {openList && createPortal(Dropdown, document.body)}

    </div>
  );
}
