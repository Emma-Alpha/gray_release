import React from 'react';
import type { ReactNode } from 'react';
import styles from './ContentWrapper.module.less';

export const ContentFormWrapper = ({ children }: { children: ReactNode }) => (
  <div
    className={`${styles['content-wrapper']} ${styles['content-wrapper-form-container']}`}
  >
    {children}
  </div>
);
