import { render, screen } from '@testing-library/react';
import SimulatePage from './SimulatePage';

test('renders learn react link', () => {
  render(<SimulatePage />);
  const linkElement = screen.getByText(/Fill and Flush Deplaning Simulator/i);
  expect(linkElement).toBeInTheDocument();
});
