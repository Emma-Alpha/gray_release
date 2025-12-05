import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../index';

describe('Loading Component', () => {
  test('renders loading container', () => {
    render(<Loading />);
    const container = screen.getByTestId('loading-container');
    expect(container).toBeInTheDocument();
  });

  test('renders loading spinner', () => {
    render(<Loading />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('spinner has animation class', () => {
    render(<Loading />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('animate-spin');
  });
});
