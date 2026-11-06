export interface Benefit {
  title: string
  description: string
}

export interface SolutionContent {
  heading: string
  benefits: readonly Benefit[]
}

export const solution: SolutionContent = {
  heading: 'Our solution',
  benefits: [
    {
      title: 'Lower carbon',
      description:
        'Designed to have a much lower carbon footprint than conventional concrete blocks.',
    },
    {
      title: 'Recycled industrial materials',
      description:
        'Made with recycled industrial materials, giving industrial leftovers a second life.',
    },
    {
      title: 'Local production',
      description: 'Designed to be produced locally, close to where they are used.',
    },
  ],
}
