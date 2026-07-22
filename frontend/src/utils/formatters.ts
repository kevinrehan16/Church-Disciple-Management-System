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