// Модальное окно с overlay, закрытием по Escape и клику на фон
import React, { useEffect } from 'react';
import styles from './Modal.module.css';

function Modal({
  isOpen = false,
  onClose,
  title = '',
  children,
  footer,
}) {
  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Блокируем скролл body когда модалка открыта
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Не рендерим если модалка закрыта
  if (!isOpen) return null;

  // Клик на overlay закрывает модалку
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {/* Заголовок с кнопкой закрытия */}
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}

        {/* Тело модального окна */}
        <div className={styles.body}>{children}</div>

        {/* Футер (опционально, для кнопок) */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;