import React, { useState } from 'react';
import { PrimaryButton } from './Button';

export const AlertsCard: React.FC = () => {
  const [isAlertActive, setIsAlertActive] = useState(true);

  return (
    <div className="rounded-xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm border border-slate-200 dark:border-transparent flex flex-col gap-4 relative z-0">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Alerts Configuration (IN PROGRESS)</h3>
      <p className="text-sm text-text-secondary">
        Set triggers for price movements, funding rates, or on-chain anomalies.
      </p>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#202933] border border-slate-200 dark:border-[#3b4754]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-text-secondary">trending_up</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Price &gt; $65k</span>
              <span className="text-xs text-text-secondary">Active • Push</span>
            </div>
          </div>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              checked={isAlertActive}
              onChange={() => setIsAlertActive(!isAlertActive)}
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white appearance-none cursor-pointer"
              style={{
                right: isAlertActive ? '0' : 'auto',
                left: isAlertActive ? 'auto' : '0',
                borderWidth: '4px',
                borderColor: isAlertActive ? '#137fec' : '#9ca3af'
              }}
            />
            <label 
              className="toggle-label block overflow-hidden h-5 rounded-full cursor-pointer"
              style={{ backgroundColor: isAlertActive ? '#137fec' : '#6b7280' }}
              onClick={() => setIsAlertActive(!isAlertActive)}
            ></label>
          </div>
        </div>
      </div>
      
      <PrimaryButton icon="add_alert">
        Create New Alert
      </PrimaryButton>
    </div>
  );
};
