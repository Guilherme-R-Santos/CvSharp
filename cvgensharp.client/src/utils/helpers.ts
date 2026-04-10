export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getATSScoreBadgeColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
  if (score >= 40) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
};

export const calculateATSScore = (cvData: any): number => {
  let score = 0;

  // Personal info (20 points)
  if (cvData.personalInfo?.fullName) score += 5;
  if (cvData.personalInfo?.email) score += 5;
  if (cvData.personalInfo?.phone) score += 5;
  if (cvData.personalInfo?.summary && cvData.personalInfo.summary.length > 50) score += 5;

  // Experience (25 points)
  const maxExp = Math.min(cvData.experience?.length || 0, 5);
  score += maxExp * 5;

  // Education (15 points)
  const maxEdu = Math.min(cvData.education?.length || 0, 3);
  score += maxEdu * 5;

  // Skills (20 points)
  const skillsScore = Math.min(cvData.skills?.length || 0, 10) * 2;
  score += skillsScore;

  // Projects (10 points)
  const maxProj = Math.min(cvData.projects?.length || 0, 2);
  score += maxProj * 5;

  // Certificates (10 points)
  const maxCerts = Math.min(cvData.certificates?.length || 0, 2);
  score += maxCerts * 5;

  return Math.min(score, 100);
};
