import { render, screen } from '@testing-library/react';
import SimulatePage from './SimulatePage';

test('renders simulate page text', () => {
  render(<SimulatePage />);
  const linkElement = screen.getByText(/Deplaning Simulator/i);
  expect(linkElement).toBeInTheDocument();
});
