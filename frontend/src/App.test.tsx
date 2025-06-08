import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PaperMind heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/PaperMind/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders documents section', () => {
  render(<App />);
  const documentsElement = screen.getByText(/Your Documents/i);
  expect(documentsElement).toBeInTheDocument();
});
