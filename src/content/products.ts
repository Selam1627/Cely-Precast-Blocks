export type ProductIconName =
  'building-block' | 'solar-ballast' | 'paving' | 'retaining-wall' | 'kerb'

export interface Product {
  /** Stable identifier, used as the list key. */
  id: string
  name: string
  /** What the block is used for. No technical specifications. */
  description: string
  icon: ProductIconName
}

export interface ProductsContent {
  heading: string
  /** Label shown on every card: all products are still in development. */
  statusLabel: string
  items: readonly Product[]
}

export const products: ProductsContent = {
  heading: 'Our planned products',
  statusLabel: 'In development',
  items: [
    {
      id: 'standard-building-blocks',
      name: 'Standard building blocks',
      description: 'For building walls in residential and commercial projects.',
      icon: 'building-block',
    },
    {
      id: 'solar-panel-ballast-blocks',
      name: 'Solar panel ballast blocks',
      description:
        'For holding solar panel mounting systems in place on flat roofs and open ground, without drilling into the roof.',
      icon: 'solar-ballast',
    },
    {
      id: 'paving-blocks',
      name: 'Paving blocks',
      description: 'For footpaths, patios, driveways and public spaces.',
      icon: 'paving',
    },
    {
      id: 'retaining-wall-and-landscaping-blocks',
      name: 'Retaining wall and landscaping blocks',
      description: 'For holding back soil on slopes and shaping gardens, terraces and planters.',
      icon: 'retaining-wall',
    },
    {
      id: 'kerbs-and-edging',
      name: 'Kerbs and edging',
      description: 'For finishing the edges of roads, paths, lawns and flower beds.',
      icon: 'kerb',
    },
  ],
}
