import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency conversion: $1 USD = ₹83 INR
const USD_TO_INR_RATE = 83;

export function convertUSDtoINR(usdAmount: number): string {
  const inrAmount = usdAmount * USD_TO_INR_RATE;
  return `₹${inrAmount.toFixed(2)}`;
}
