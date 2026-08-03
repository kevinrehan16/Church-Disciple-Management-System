export const getInitials = (name: string | undefined | null): string => {
  if (!name) return '??';
  
  return name
    .split(' ')
    .filter(n => n.length > 0) // Iwasan ang empty strings kung double spaces
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};


export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Kung hindi pa sumasapit ang birth month o birthday sa taong ito, bawas ng 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const getLifestageStyles = (stage: string) => {
  const styles: Record<string, string> = {
    'Single': 'bg-blue-50 text-blue-600 border-blue-100',
    'Married': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Separated': 'bg-amber-50 text-amber-600 border-amber-100',
    'Widowed': 'bg-slate-100 text-slate-600 border-slate-200',
    'Divorced': 'bg-rose-100 text-rose-600 border-rose-200',
  };
  // Default style kung walang match
  return styles[stage] || 'bg-slate-50 text-slate-500 border-slate-100';
};

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';

  // Hatiin ang "2002-02-14" sa taon, buwan, at araw
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;

  // Gumawa ng Date object (Month ay 0-indexed sa JS kaya binawasan ng 1)
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (isNaN(date.getTime())) return dateString;

  // I-format gamit ang Intl.DateTimeFormat para maging "Feb 14, 2002"
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',  // Feb
    day: 'numeric',  // 14
    year: 'numeric', // 2002
  }).format(date);
}

export const formatTime = (timeStr: string) => {
  try {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
};

export function sanitizeNumber(value: string, maxLength: number = 11): string {
  // Tanggalin lahat ng hindi numero
  const numbersOnly = value.replace(/\D/g, '');
  
  // Limitahan sa maximum length (default ay 11 para sa PH mobile numbers)
  return numbersOnly.slice(0, maxLength);
}