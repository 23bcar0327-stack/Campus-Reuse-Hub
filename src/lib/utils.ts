import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in INR (prices are stored in INR in database, no conversion needed)
export function formatPriceINR(priceInINR: number): string {
  return `₹${priceInINR.toFixed(2)}`;
}
