// ScrollToTop.tsx
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-[100px] right-[42px] z-50 flex items-center justify-center
  w-12 h-12 rounded-full
  bg-gradient-to-br from-[#1F6F85] via-[#288FA8] to-[#34AFCB]
  text-white
  shadow-[0_0_15px_rgba(31,111,133,0.4)]
  backdrop-blur-md
  transition-all duration-300 ease-out
  hover:scale-110 hover:shadow-[0_0_25px_rgba(52,175,203,0.6)]
  active:scale-95
  ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `}
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
