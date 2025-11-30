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

// Get initials from patient name (ex: "João Silva" -> "JS")
export function getPatientInitials(patientName: string): string {
  const names = patientName.trim().split(' ').filter(n => n.length > 0);
  if (names.length === 0) return '??';
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

// Get consistent color for initials avatar based on name
export function getInitialsColor(patientName: string): { bg: string; text: string } {
  const colors = [
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-pink-100', text: 'text-pink-700' },
    { bg: 'bg-green-100', text: 'text-green-700' },
    { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    { bg: 'bg-red-100', text: 'text-red-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  ];

  const hash = patientName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// Calculate time difference in minutes and return formatted string
export function getTimeUntil(targetTime: string): { minutes: number; formatted: string } {
  const now = new Date();
  const [hours, mins] = targetTime.split(':').map(Number);
  const target = new Date();
  target.setHours(hours, mins, 0, 0);

  const diffMinutes = Math.floor((target.getTime() - now.getTime()) / 60000);

  if (diffMinutes < 0) {
    const absMin = Math.abs(diffMinutes);
    return {
      minutes: diffMinutes,
      formatted: `há ${absMin} min`
    };
  } else if (diffMinutes === 0) {
    return { minutes: 0, formatted: 'agora' };
  } else {
    return {
      minutes: diffMinutes,
      formatted: `em ${diffMinutes} min`
    };
  }
}
