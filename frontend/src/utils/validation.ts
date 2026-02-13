// src/utils/validation.ts

import { User as UserType } from '@/types/auth';

// Helper function to remove non-digit characters (to handle user formatting like "(123) 456-7890")
const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d]/g, ''); 
};

const PHONE_REGEX = /^\d{10}$/; 
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 

interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

/**
 * Validates essential contact and email fields before saving.
 */
export const validateProfileData = (data: Partial<UserType>, toast: (props: ToastProps) => void): boolean => {
  const { phone, emergencyPhone, email } = data;

  // --- PHONE NUMBER VALIDATION ---
  if (phone && phone.trim() !== '') {
    const cleanedPhone = cleanPhoneNumber(phone); 
    if (!PHONE_REGEX.test(cleanedPhone)) {
      toast({
        title: 'Validation Error',
        description: 'Phone Number must contain exactly 10 digits (excluding spaces/formatting).',
        variant: 'destructive',
      });
      return false;
    }
  }

  // --- EMERGENCY PHONE VALIDATION ---
  if (emergencyPhone && emergencyPhone.trim() !== '') {
    const cleanedEmergencyPhone = cleanPhoneNumber(emergencyPhone); 
    if (!PHONE_REGEX.test(cleanedEmergencyPhone)) {
      toast({
        title: 'Validation Error',
        description: 'Emergency Phone must contain exactly 10 digits.',
        variant: 'destructive',
      });
      return false;
    }
  }
  
  // --- EMAIL VALIDATION ---
  // The email field in the Basic Info tab (line 324)
  if (email && email.trim() !== '' && !EMAIL_REGEX.test(email.trim())) {
    toast({
      title: 'Validation Error',
      description: 'Please enter a valid email address format (e.g., user@example.com).',
      variant: 'destructive',
    });
    return false;
  }

  return true; // Validation PASSED. Save should proceed.
};