export interface Audience {
  /** Stable identifier, used as the list key. */
  id: string
  title: string
  description: string
}

export interface AudiencesContent {
  heading: string
  items: readonly Audience[]
}

export const audiences: AudiencesContent = {
  heading: 'Work with us',
  items: [
    {
      id: 'customers',
      title: 'For customers',
      description:
        'Architects, engineers, builders and developers: talk to us about how our planned lower-carbon blocks could fit your projects.',
    },
    {
      id: 'investors',
      title: 'For investors',
      description:
        'We are an early-stage company developing lower-carbon precast blocks, and we are seeking funding to start research and lab development. Get in touch to start a conversation.',
    },
    {
      id: 'partners',
      title: 'For partners',
      description:
        'We welcome conversations with industrial companies, research institutions and other organisations interested in collaborating on lower-carbon building products.',
    },
  ],
}
