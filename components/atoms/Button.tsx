import { ReactHTML } from 'react';

const shadows = `shadow-md hover:shadow-lg` as const;
const common = `font-sans font-normal py-2 px-4 rounded-md transition-all` as const;
const variants = {
  primary: `bg-blue-400 text-gray-100 hover:bg-blue-600 ${common} ${shadows}` as const,
  secondary: `bg-transparent text-blue-400 ${common} ${shadows}` as const,
  link: `text-blue-400 hover:bg-gray-200 ${common}` as const,
  success: `bg-green-600 text-gray-100 hover:bg-green-700 ${common} ${shadows}` as const,
  danger: `bg-red-500 text-gray-100 hover:bg-red-900 ${common} ${shadows}` as const,
};

type Variant = keyof typeof variants;

export const Button = ({ variant = 'primary', ...props }: ReactHTML['button'] & { variant: Variant }) => {
  return <button {...props} className={variants[variant]} />;
};
