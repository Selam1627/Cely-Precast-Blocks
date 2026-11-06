export interface ContactContent {
  heading: string
  labels: {
    name: string
    email: string
    visitorType: string
    product: string
    message: string
  }
  visitorTypes: readonly string[]
  visitorTypePrompt: string
  productPrompt: string
  submitLabel: string
  /** Shown instead of opening an email when no contact address is configured. */
  unavailableMessage: string
  /** Followed by the contact address, as a link. */
  directContactPrefix: string
  errors: {
    nameRequired: string
    emailRequired: string
    emailInvalid: string
    visitorTypeRequired: string
    messageRequired: string
  }
  email: {
    /** Followed by the visitor's name. */
    subjectPrefix: string
    nameLabel: string
    emailLabel: string
    visitorTypeLabel: string
    productLabel: string
  }
}

export const contact: ContactContent = {
  heading: 'Contact us',
  labels: {
    name: 'Name',
    email: 'Email',
    visitorType: 'I am a...',
    product: 'Product of interest (optional)',
    message: 'Message',
  },
  visitorTypes: [
    'Architect',
    'Engineer',
    'Builder',
    'Real estate developer',
    'Investor',
    'Partner',
    'Other',
  ],
  visitorTypePrompt: 'Select one',
  productPrompt: 'No specific product',
  submitLabel: 'Send message',
  unavailableMessage: 'The contact form is not available right now.',
  directContactPrefix: 'Or write to us directly at',
  errors: {
    nameRequired: 'Please enter your name.',
    emailRequired: 'Please enter your email address.',
    emailInvalid: 'Please enter a valid email address, for example name@example.com.',
    visitorTypeRequired: 'Please select who you are.',
    messageRequired: 'Please enter a message.',
  },
  email: {
    subjectPrefix: 'Website enquiry from',
    nameLabel: 'Name',
    emailLabel: 'Email',
    visitorTypeLabel: 'Visitor type',
    productLabel: 'Product of interest',
  },
}
