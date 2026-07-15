import { useState } from 'react';

export const modalAnimation = (onClose: () => void) => {
  const [isClosing, setIsClosing] = useState(false);

  const startClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    // 1. Pigilan ang pag-bubble up ng event mula sa mga bata (children)
    e.stopPropagation();

    // 2. I-check kung 'closing' ang state AT kung ang natapos na animation ay 'fadeOut' o 'slideOut'
    // Importante ito para hindi mag-close ang modal dahil lang sa ibang animation
    if (isClosing && (e.animationName === 'fadeOut' || e.animationName === 'slideOut')) {
      setIsClosing(false);
      onClose();
    }
  };

  return { isClosing, startClose, handleAnimationEnd };
};