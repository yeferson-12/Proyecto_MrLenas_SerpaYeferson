import { render, screen, fireEvent } from '@testing-library/react';
import Login from './pages/Login';

const mockOnLogin = jest.fn();

jest.mock('./services/api', () => ({
  post: jest.fn(),
}));

test('renders login form', () => {
  render(<Login onLogin={mockOnLogin} />);
  expect(screen.getByText('Mr. Leñas')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('usuario@mrlenas.com')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  expect(screen.getByText('Ingresar')).toBeInTheDocument();
});

test('updates email and password fields', () => {
  render(<Login onLogin={mockOnLogin} />);
  const emailInput = screen.getByPlaceholderText('usuario@mrlenas.com');
  const passwordInput = screen.getByPlaceholderText('••••••••');
  fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
  fireEvent.change(passwordInput, { target: { value: '123456' } });
  expect(emailInput.value).toBe('test@test.com');
  expect(passwordInput.value).toBe('123456');
});
