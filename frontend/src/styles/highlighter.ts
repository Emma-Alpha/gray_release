
import { ReactNode, type Ref } from 'react';
import { FlexboxProps } from 'react-layout-kit';

import { DivProps } from '@/types';

export interface SyntaxHighlighterProps extends DivProps {
  animated?: boolean;
  children: string;
  enableTransformer?: HighlighterProps['enableTransformer'];
  language: HighlighterProps['language'];
  ref?: Ref<HTMLDivElement>;
  theme?: HighlighterProps['theme'];
  variant?: HighlighterProps['variant'];
}

export interface HighlighterProps extends Omit<FlexboxProps, 'children' | 'wrap'> {
  allowChangeLanguage?: boolean;
  animated?: boolean;
  bodyRender?: (props: { content: string; language: string; originalNode: ReactNode }) => ReactNode;
  children: string;
  copyable?: boolean;
  defaultExpand?: boolean;
  enableTransformer?: boolean;
  fileName?: string;
  fullFeatured?: boolean;
  icon?: ReactNode;
  language: string;
  shadow?: boolean;
  showLanguage?: boolean;
  theme?: 'lobe-theme';
  variant?: 'filled' | 'outlined' | 'borderless';
  wrap?: boolean;
}
