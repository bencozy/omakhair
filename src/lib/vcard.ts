/**
 * Utility functions for generating vCard contact data
 */

export interface ContactInfo {
  name: string;
  organization?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  note?: string;
  socialMedia?: {
    instagram?: string;
    snapchat?: string;
    tiktok?: string;
  };
}

/**
 * Generates a vCard (VCF) string from contact information
 * This format is widely supported across iOS and Android devices
 */
export function generateVCard(contact: ContactInfo): string {
  const lines: string[] = [];
  
  // vCard version and start
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  
  // Full name
  lines.push(`FN:${contact.name}`);
  lines.push(`N:${contact.name};;;;`);
  
  // Organization
  if (contact.organization) {
    lines.push(`ORG:${contact.organization}`);
  }
  
  // Phone number
  if (contact.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${contact.phone}`);
  }
  
  // Email
  if (contact.email) {
    lines.push(`EMAIL;TYPE=WORK:${contact.email}`);
  }
  
  // Website
  if (contact.website) {
    lines.push(`URL:${contact.website}`);
  }
  
  // Social Media URLs with proper labels (single format to avoid duplication)
  if (contact.socialMedia?.instagram) {
    lines.push(`URL;TYPE=Instagram:${contact.socialMedia.instagram}`);
  }
  
  if (contact.socialMedia?.snapchat) {
    lines.push(`URL;TYPE=Snapchat:${contact.socialMedia.snapchat}`);
  }
  
  if (contact.socialMedia?.tiktok) {
    lines.push(`URL;TYPE=TikTok:${contact.socialMedia.tiktok}`);
  }
  
  // Address
  if (contact.address) {
    const { street = '', city = '', state = '', zip = '', country = '' } = contact.address;
    lines.push(`ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}`);
  }
  
  // Note with social media info for better visibility
  let noteText = contact.note || '';
  if (contact.socialMedia) {
    const socialLinks: string[] = [];
    if (contact.socialMedia.instagram) socialLinks.push(`Instagram: ${contact.socialMedia.instagram}`);
    if (contact.socialMedia.snapchat) socialLinks.push(`Snapchat: ${contact.socialMedia.snapchat}`);
    if (contact.socialMedia.tiktok) socialLinks.push(`TikTok: ${contact.socialMedia.tiktok}`);
    
    if (socialLinks.length > 0) {
      noteText += (noteText ? '\\n\\nSocial Media:\\n' : 'Social Media:\\n') + socialLinks.join('\\n');
    }
  }
  
  if (noteText) {
    lines.push(`NOTE:${noteText}`);
  }
  
  // End vCard
  lines.push('END:VCARD');
  
  return lines.join('\n');
}

/**
 * Creates a downloadable vCard file blob
 */
export function createVCardBlob(contact: ContactInfo): Blob {
  const vCardString = generateVCard(contact);
  return new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
}

/**
 * Triggers download of vCard file
 */
export function downloadVCard(contact: ContactInfo, filename?: string): void {
  const blob = createVCardBlob(contact);
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${contact.name.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Omakhair business contact information
 */
export const OMAKHAIR_CONTACT: ContactInfo = {
  name: 'Oma Khair',
  organization: 'Oma Khair Hair & Beauty',
  phone: '(555) 123-4567',
  email: 'laidbyoma@gmail.com',
  website: 'https://omakhair.com',
  address: {
    street: '123 Beauty Ave',
    city: 'Style City',
    state: '',
    zip: '',
    country: 'USA'
  },
  note: 'Professional Hair Services',
  socialMedia: {
    snapchat: 'https://t.snapchat.com/Jh69xMdA',
    instagram: 'https://www.instagram.com/shopper_huz',
    tiktok: 'https://www.tiktok.com/@lyn_signature1'
  }
};
