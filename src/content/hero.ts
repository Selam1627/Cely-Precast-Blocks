export interface HeroAction {
  label: string
  /** In-page anchor of the section the button scrolls to. */
  href: `#${string}`
}

export interface HeroContent {
  companyName: string
  tagline: string
  /** The first action is shown as the primary button. */
  actions: readonly HeroAction[]
}

export const hero: HeroContent = {
  companyName: 'CelyMary Greener Precast Blocks',
  tagline: 'Greener precast blocks for lower-carbon buildings.',
  actions: [
    { label: 'Work with us', href: '#work-with-us' },
    { label: 'Contact', href: '#contact' },
  ],
}
