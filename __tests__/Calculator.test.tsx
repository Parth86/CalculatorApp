import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '../components/Calculator';

describe('Calculator', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  it('renders correctly', () => {
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.getByText('DEL')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
  });

  it('handles addition', () => {
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('='));

    // Check current operand (display)
    const currentOperand = screen.getByTestId('current-operand');
    expect(currentOperand).toHaveTextContent('3');
  });

  it('handles subtraction', () => {
      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('-'));
      fireEvent.click(screen.getByText('2'));
      fireEvent.click(screen.getByText('='));

      const currentOperand = screen.getByTestId('current-operand');
      expect(currentOperand).toHaveTextContent('3');
  });

  it('handles multiplication', () => {
      fireEvent.click(screen.getByText('4'));
      fireEvent.click(screen.getByText('*'));
      fireEvent.click(screen.getByText('2'));
      fireEvent.click(screen.getByText('='));

      const currentOperand = screen.getByTestId('current-operand');
      expect(currentOperand).toHaveTextContent('8');
  });

  it('handles division', () => {
      fireEvent.click(screen.getByText('8'));
      fireEvent.click(screen.getByText('÷'));
      fireEvent.click(screen.getByText('2'));
      fireEvent.click(screen.getByText('='));

      const currentOperand = screen.getByTestId('current-operand');
      expect(currentOperand).toHaveTextContent('4');
  });

  it('clears the display', () => {
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('AC'));

    const currentOperand = screen.getByTestId('current-operand');
    expect(currentOperand).toHaveTextContent('');
    const previousOperand = screen.getByTestId('previous-operand');
    expect(previousOperand).toHaveTextContent('');
  });

  it('deletes digits', () => {
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('DEL'));

    const currentOperand = screen.getByTestId('current-operand');
    expect(currentOperand).toHaveTextContent('1');
  });
});
