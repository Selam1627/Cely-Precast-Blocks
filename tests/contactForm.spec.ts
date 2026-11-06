import { afterEach, describe, expect, it, vi } from 'vitest'

import { contact } from '@/content/contact'
import {
  buildMailtoUrl,
  isValidEmail,
  openEmail,
  validateContactForm,
  type ContactFormValues,
} from '@/utils/contactForm'

const validValues: ContactFormValues = {
  name: 'Test Visitor',
  email: 'visitor@example.com',
  visitorType: 'Architect',
  product: 'Paving blocks',
  message: 'Test message.',
}

/** Reads the subject and body back out of an email link. */
function parseMailto(url: string) {
  const parsed = new URL(url)
  return {
    protocol: parsed.protocol,
    to: parsed.pathname,
    params: [...parsed.searchParams.keys()],
    subject: parsed.searchParams.get('subject'),
    body: parsed.searchParams.get('body'),
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('validateContactForm', () => {
  describe('normal cases', () => {
    it('finds no errors when every field is filled in', () => {
      expect(validateContactForm(validValues)).toEqual({})
    })

    it('does not require a product', () => {
      expect(validateContactForm({ ...validValues, product: '' })).toEqual({})
    })
  })

  describe('expected errors', () => {
    it('reports every required field when the form is empty', () => {
      const errors = validateContactForm({
        name: '',
        email: '',
        visitorType: '',
        product: '',
        message: '',
      })

      expect(errors).toEqual({
        name: contact.errors.nameRequired,
        email: contact.errors.emailRequired,
        visitorType: contact.errors.visitorTypeRequired,
        message: contact.errors.messageRequired,
      })
    })

    it('treats fields with only spaces as empty', () => {
      const errors = validateContactForm({
        ...validValues,
        name: '   ',
        email: '   ',
        message: ' \n ',
      })

      expect(errors).toEqual({
        name: contact.errors.nameRequired,
        email: contact.errors.emailRequired,
        message: contact.errors.messageRequired,
      })
    })

    it('uses a different message for a badly formatted email', () => {
      const errors = validateContactForm({ ...validValues, email: 'not-an-email' })

      expect(errors).toEqual({ email: contact.errors.emailInvalid })
    })
  })
})

describe('isValidEmail', () => {
  it.each([
    'name@example.com',
    'first.last@example.co.uk',
    'name+tag@example.com',
    '  name@example.com  ',
  ])('accepts %j', (email) => {
    expect(isValidEmail(email)).toBe(true)
  })

  it.each([
    '',
    'name',
    'name@',
    '@example.com',
    'name@example',
    'name@example.',
    'first last@example.com',
    'name@exa mple.com',
    'name@@example.com',
  ])('rejects %j', (email) => {
    expect(isValidEmail(email)).toBe(false)
  })
})

describe('buildMailtoUrl', () => {
  describe('normal cases', () => {
    it('sends the email to the given address with a subject naming the visitor', () => {
      const email = parseMailto(buildMailtoUrl('contact@example.com', validValues))

      expect(email.protocol).toBe('mailto:')
      expect(email.to).toBe('contact@example.com')
      expect(email.subject).toBe('Website enquiry from Test Visitor')
    })

    it('fills the body with the details, then the message', () => {
      const email = parseMailto(buildMailtoUrl('contact@example.com', validValues))

      expect(email.body).toBe(
        [
          'Name: Test Visitor',
          'Email: visitor@example.com',
          'Visitor type: Architect',
          'Product of interest: Paving blocks',
          '',
          'Test message.',
        ].join('\r\n'),
      )
    })
  })

  describe('edge cases', () => {
    it('leaves out the product line when no product is chosen', () => {
      const email = parseMailto(
        buildMailtoUrl('contact@example.com', { ...validValues, product: '' }),
      )

      expect(email.body).not.toContain('Product of interest')
    })

    it('removes spaces around what the visitor typed', () => {
      const email = parseMailto(
        buildMailtoUrl('contact@example.com', {
          ...validValues,
          name: '  Test Visitor  ',
          email: '  visitor@example.com  ',
          message: '  Test message.  ',
        }),
      )

      expect(email.subject).toBe('Website enquiry from Test Visitor')
      expect(email.body).toContain('Email: visitor@example.com\r\n')
      expect(email.body!.endsWith('\r\n\r\nTest message.')).toBe(true)
    })

    it('keeps the line breaks in a message', () => {
      const email = parseMailto(
        buildMailtoUrl('contact@example.com', { ...validValues, message: 'Line one\nLine two' }),
      )

      expect(email.body).toContain('Line one\r\nLine two')
    })

    it('keeps accents and symbols intact', () => {
      const message = 'Hola, ¿cómo están? 100% + más & "otros" #1'
      const email = parseMailto(buildMailtoUrl('contact@example.com', { ...validValues, message }))

      expect(email.body).toContain(message)
    })
  })

  describe('expected errors', () => {
    it('cannot be tricked into adding recipients or other email headers', () => {
      const email = parseMailto(
        buildMailtoUrl('contact@example.com', {
          ...validValues,
          name: 'Test&bcc=other@example.com',
          message: 'Test?cc=other@example.com&subject=Changed',
        }),
      )

      expect(email.params).toEqual(['subject', 'body'])
      expect(email.subject).toBe('Website enquiry from Test&bcc=other@example.com')
    })
  })
})

describe('openEmail', () => {
  it('sends the browser to the email link', () => {
    const location = { href: '' }
    vi.stubGlobal('location', location)

    openEmail('mailto:contact@example.com')

    expect(location.href).toBe('mailto:contact@example.com')
  })
})
