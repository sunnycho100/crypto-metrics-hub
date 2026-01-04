import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalCardProps {
  id: string;
  children: React.ReactNode;
  modalTitle: string;
  modalContent: React.ReactNode;
}

export const ModalCard: React.FC<ModalCardProps> = ({ children, modalTitle, modalContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset position when modal opens
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return;
    
    const rect = modalRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      setPosition({
        x: e.clientX - centerX - dragOffset.x + (modalRef.current?.offsetWidth || 0) / 2,
        y: e.clientY - centerY - dragOffset.y + (modalRef.current?.offsetHeight || 0) / 2
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const modalElement = isOpen ? createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        style={{ zIndex: 99998 }}
        onClick={() => setIsOpen(false)}
      />
      <div 
        ref={modalRef}
        className="fixed w-[90%] max-w-sm"
        style={{
          zIndex: 99999,
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        <div className="relative bg-white dark:bg-[#1c2229] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div 
            className="flex justify-between items-center mb-6 cursor-move select-none"
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{modalTitle}</h3>
            <button
              className="text-text-secondary hover:text-primary cursor-pointer transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="space-y-4">
            {modalContent}
          </div>
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      <div
        className="cursor-pointer block h-full select-none"
        onClick={() => setIsOpen(true)}
      >
        {children}
      </div>
      {modalElement}
    </>
  );
};

interface ModalRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  subValue?: string;
}

export const ModalRow: React.FC<ModalRowProps> = ({ label, value, valueColor = 'default', subValue }) => {
  const valueColorClass = {
    default: 'text-slate-900 dark:text-white',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    neutral: 'text-slate-500 dark:text-slate-400'
  }[valueColor];

  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-[#111418]">
      <span className="text-text-secondary text-sm">{label}</span>
      <div className="text-right">
        <span className={`font-bold ${valueColorClass}`}>{value}</span>
        {subValue && <span className="block text-xs text-danger">{subValue}</span>}
      </div>
    </div>
  );
};
