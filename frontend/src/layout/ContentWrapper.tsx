import React from 'react';
import type { ReactNode } from 'react';
import styles from './ContentWrapper.module.less';

export const ContentWrapper = ({ children }: { children: ReactNode }) => (
  <div className={styles.content_wrapper}>
    <div
      className={`${styles['content-wrapper']} ${styles['content-wrapper-list']}`}
    >
      {children}
    </div>
  </div>
);
