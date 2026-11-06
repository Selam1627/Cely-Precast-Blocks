import { contact } from '@/content/contact'

export interface ContactFormValues {
  name: string
  email: string
  visitorType: string
  /** Optional: an empty string means no specific product. */
  product: string
  message: string
}

/** The required fields, in the order they appear on the form. */
export const requiredFields = ['name', 'email', 'visitorType', 'message'] as const

export type RequiredField = (typeof requiredFields)[number]

export type ContactFormErrors = Partial<Record<RequiredField, string>>

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Returns an error message for each field with a problem; empty when all are valid. */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!values.name.trim()) {
    errors.name = contact.errors.nameRequired
  }

  if (!values.email.trim()) {
    errors.email = contact.errors.emailRequired
  } else if (!isValidEmail(values.email)) {
    errors.email = contact.errors.emailInvalid
  }

  if (!values.visitorType) {
    errors.visitorType = contact.errors.visitorTypeRequired
  }

  if (!values.message.trim()) {
    errors.message = contact.errors.messageRequired
  }

  return errors
}

/**
 * Builds the pre-filled email link. Everything the visitor typed is encoded, so
 * it can't add recipients or other email headers to the link.
 */
export function buildMailtoUrl(to: string, values: ContactFormValues): string {
  const { email } = contact
  const name = values.name.trim()

  const details = [
    `${email.nameLabel}: ${name}`,
    `${email.emailLabel}: ${values.email.trim()}`,
    `${email.visitorTypeLabel}: ${values.visitorType}`,
  ]
  if (values.product) {
    details.push(`${email.productLabel}: ${values.product}`)
  }

  const subject = `${email.subjectPrefix} ${name}`
  // Email links use CRLF line breaks (RFC 6068).
  const body = `${details.join('\r\n')}\r\n\r\n${values.message.trim()}`.replace(/\r?\n/g, '\r\n')

  return `mailto:${encodeURI(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** Opens the visitor's email app. */
export function openEmail(url: string): void {
  window.location.href = url
}
