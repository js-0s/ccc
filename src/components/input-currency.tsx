import { cn } from '@/lib/utils';
import * as React from 'react';

type InputType = React.HTMLInputTypeAttribute | 'currency';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currencyFormat?: Intl.NumberFormat;
  decimals: number;
  type?: InputType;
}

const defaultCurrencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const InputCurrency = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      currencyFormat,
      decimals,
      onChange,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const isCurrency = type === 'currency';
    const inputType = isCurrency ? 'text' : type;

    const formatCurrency = (value: number) => {
      return (currencyFormat ?? defaultCurrencyFormat).format(value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isCurrency) {
        const target = e.currentTarget;
        target.setSelectionRange(target.value.length, target.value.length);
      }
      onFocus?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isCurrency) {
        const target = e.currentTarget;
        console.log(
          Number(target.value.replace(/\D/g, '')),
          Math.pow(10, decimals),
        );
        const numericValue =
          Number(target.value.replace(/\D/g, '')) / Math.pow(10, decimals);
        target.value = formatCurrency(numericValue);
      }
      onChange?.(e);
    };

    return (
      <input
        type={inputType}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm',
          'file:font-medium file:text-foreground placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          isCurrency && 'text-end',
          className,
        )}
        maxLength={isCurrency ? 22 : undefined}
        onFocus={handleFocus}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  },
);
InputCurrency.displayName = 'InputCurrency';

export { InputCurrency };
