import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate consistent avatar URL based on patient name
export function getPatientAvatar(patientName: string): string {
  // Generate a consistent number from the patient name
  const hash = patientName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = (hash % 100) + 1; // Use numbers 1-100
  const gender = hash % 2 === 0 ? 'men' : 'women';
  return `https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`;
}
