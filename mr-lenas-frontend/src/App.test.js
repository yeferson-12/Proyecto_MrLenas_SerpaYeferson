import { render, screen, fireEvent } from '@testing-library/react';
import Login from './pages/Login';
import Pedidos from './pages/Pedidos';

jest.mock('./services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: { token: 'abc', user: { name: 'Test' } } })),
}));

// LOGIN TESTS
describe('Login', () => {
  const mockOnLogin = jest.fn();

  test('renders login form elements', () => {
    render(<Login onLogin={mockOnLogin} />);
    expect(screen.getByText('Mr. Leñas')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Gestión')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('usuario@mrlenas.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Ingresar')).toBeInTheDocument();
  });

  test('updates email input', () => {
    render(<Login onLogin={mockOnLogin} />);
    const input = screen.getByPlaceholderText('usuario@mrlenas.com');
    fireEvent.change(input, { target: { value: 'test@test.com' } });
    expect(input.value).toBe('test@test.com');
  });

  test('updates password input', () => {
    render(<Login onLogin={mockOnLogin} />);
    const input = screen.getByPlaceholderText('••••••••');
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input.value).toBe('123456');
  });

  test('submit button is enabled', () => {
    render(<Login onLogin={mockOnLogin} />);
    expect(screen.getByText('Ingresar')).not.toBeDisabled();
  });
});

// PEDIDOS TESTS
describe('Pedidos', () => {
  test('renders pedidos sections', () => {
    render(<Pedidos />);
    expect(screen.getByText('Menú')).toBeInTheDocument();
    expect(screen.getByText('Nuevo Pedido')).toBeInTheDocument();
    expect(screen.getByText('Pedidos Activos')).toBeInTheDocument();
  });

  test('renders table number input', () => {
    render(<Pedidos />);
    expect(screen.getByPlaceholderText('Número de mesa')).toBeInTheDocument();
  });

  test('renders notes textarea', () => {
    render(<Pedidos />);
    expect(screen.getByPlaceholderText('Notas adicionales (opcional)')).toBeInTheDocument();
  });

  test('renders send button', () => {
    render(<Pedidos />);
    expect(screen.getByText('Enviar a cocina')).toBeInTheDocument();
  });

  test('updates table number', () => {
    render(<Pedidos />);
    const input = screen.getByPlaceholderText('Número de mesa');
    fireEvent.change(input, { target: { value: '5' } });
    expect(input.value).toBe('5');
  });

  test('shows error when submitting without table', () => {
    render(<Pedidos />);
    fireEvent.click(screen.getByText('Enviar a cocina'));
    expect(screen.getByText('Ingresa el número de mesa.')).toBeInTheDocument();
  });

  test('shows empty orders message', () => {
    render(<Pedidos />);
    expect(screen.getByText('Sin pedidos activos.')).toBeInTheDocument();
  });
});
