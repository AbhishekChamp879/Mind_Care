import { ButtonHTMLAttributes, FC } from 'react';

export interface BaseComponentProps {
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'outline' | 'ghost' | 'link' | 'default';
  isLoading?: boolean;
}

export interface ReadingModeButtonProps extends ButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'outline' | 'ghost';
}

export interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}