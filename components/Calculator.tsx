'use client';

import React, { useReducer } from 'react';

// Actions
type Action =
  | { type: 'add-digit'; payload: { digit: string } }
  | { type: 'choose-operation'; payload: { operation: string } }
  | { type: 'clear' }
  | { type: 'delete-digit' }
  | { type: 'evaluate' };

// State
interface State {
  currentOperand: string | null;
  previousOperand: string | null;
  operation: string | null;
  overwrite?: boolean;
}

const initialState: State = {
  currentOperand: null,
  previousOperand: null,
  operation: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add-digit':
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload.digit,
          overwrite: false,
        };
      }
      if (action.payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }
      if (action.payload.digit === '.' && state.currentOperand?.includes('.')) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${action.payload.digit}`,
      };

    case 'choose-operation':
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      };

    case 'clear':
      return initialState;

    case 'delete-digit':
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case 'evaluate':
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }: State): string {
  const prev = parseFloat(previousOperand || '');
  const current = parseFloat(currentOperand || '');
  if (isNaN(prev) || isNaN(current)) return '';
  let computation = 0;
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '÷':
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

function formatOperand(operand: string | null) {
  if (operand == null) return '';
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(parseFloat(integer));
  return `${INTEGER_FORMATTER.format(parseFloat(integer))}.${decimal}`;
}

export default function Calculator() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="grid grid-cols-4 gap-2 bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-xs">
        {/* Display */}
        <div data-testid="display" className="col-span-4 bg-black rounded p-4 mb-4 flex flex-col items-end justify-around break-all min-h-[6rem]">
          <div data-testid="previous-operand" className="text-gray-400 text-sm">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div data-testid="current-operand" className="text-white text-3xl font-bold">
            {formatOperand(currentOperand)}
          </div>
        </div>

        {/* Buttons */}
        <button
          className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded"
          onClick={() => dispatch({ type: 'clear' })}
        >
          AC
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded"
          onClick={() => dispatch({ type: 'delete-digit' })}
        >
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded"
          onClick={() => dispatch({ type: 'evaluate' })}
        >
          =
        </button>
      </div>
    </div>
  );
}

function DigitButton({
  dispatch,
  digit,
}: {
  dispatch: React.Dispatch<Action>;
  digit: string;
}) {
  return (
    <button
      className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded"
      onClick={() => dispatch({ type: 'add-digit', payload: { digit } })}
    >
      {digit}
    </button>
  );
}

function OperationButton({
  dispatch,
  operation,
}: {
  dispatch: React.Dispatch<Action>;
  operation: string;
}) {
  return (
    <button
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded"
      onClick={() =>
        dispatch({ type: 'choose-operation', payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
