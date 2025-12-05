import { FlexboxProps } from 'react-layout-kit';

export interface MermaidProps extends Omit<FlexboxProps, 'children' | 'wrap'> {
  children: string;
  theme?: 'lobe-theme';
  wrap?: boolean;
}
