import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
interface ColorVariants {
  bgColor: string;
  lightBg: string;
  textColor: string;
  borderColor?: string;
  hoverBg?: string;
}

// export const getColorVariants = (baseColor: string): ColorVariants => {

//   const colorMatch = baseColor.match(/bg-(\w+)-(\d+)/);
  
//   if (!colorMatch) {

//     return {
//       bgColor: 'bg-gray-600',
//       lightBg: 'bg-gray-200',
//       textColor: 'text-gray-800',
//       borderColor: 'border-gray-300',
//       hoverBg: 'hover:bg-gray-700'
//     };
//   }

//   const [, colorName, shade] = colorMatch;

//   return {
//     bgColor: `bg-${colorName}-${shade}`,
//     lightBg: `bg-${colorName}-200`,
//     textColor: `text-${colorName}-800`,
//     borderColor: `border-${colorName}-300`,
//     hoverBg: `hover:bg-${colorName}-700`
//   };
// };
export const getColorVariants = (baseColor: string): ColorVariants => {
  const colorMappings: Record<string, ColorVariants> = {
    'bg-red-600': {
      bgColor: 'bg-red-600',
      lightBg: 'bg-red-200',
      textColor: 'text-foreground',
      borderColor: 'border-red-300',
      hoverBg: 'hover:bg-red-700'
    },
    'bg-green-600': {
      bgColor: 'bg-green-600',
      lightBg: 'bg-green-200',
      textColor: 'text-foreground',
      borderColor: 'border-green-300',
      hoverBg: 'hover:bg-green-700'
    },
    'bg-blue-600': {
      bgColor: 'bg-blue-600',
      lightBg: 'bg-blue-200',
      textColor: 'text-foreground',
      borderColor: 'border-blue-300',
      hoverBg: 'hover:bg-blue-700'
    },
    'bg-yellow-600': {
      bgColor: 'bg-yellow-600',
      lightBg: 'bg-yellow-200',
      textColor: 'text-foreground',
      borderColor: 'border-yellow-300',
      hoverBg: 'hover:bg-yellow-700'
    },
    'bg-purple-600': {
      bgColor: 'bg-purple-600',
      lightBg: 'bg-purple-200',
      textColor: 'text-foreground',
      borderColor: 'border-purple-300',
      hoverBg: 'hover:bg-purple-700'
    },
    'bg-pink-600': {
      bgColor: 'bg-pink-600',
      lightBg: 'bg-pink-200',
      textColor: 'text-foreground',
      borderColor: 'border-pink-300',
      hoverBg: 'hover:bg-pink-700'
    },
    'bg-indigo-600': {
      bgColor: 'bg-indigo-600',
      lightBg: 'bg-indigo-200',
      textColor: 'text-foreground',
      borderColor: 'border-indigo-300',
      hoverBg: 'hover:bg-indigo-700'
    },
    'bg-gray-600': {
      bgColor: 'bg-gray-600',
      lightBg: 'bg-gray-200',
      textColor: 'text-foreground',
      borderColor: 'border-gray-300',
      hoverBg: 'hover:bg-gray-700'
    }
  };

  return colorMappings[baseColor] || colorMappings['bg-gray-600'];
};