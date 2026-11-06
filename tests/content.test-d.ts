/**
 * Type-level tests: they check that TypeScript rejects invalid content in
 * src/content before it can reach the page. Vitest checks them with vue-tsc
 * (see vitest.config.ts); this code never runs.
 */
import { describe, expectTypeOf, it } from 'vitest'

import type { Audience } from '@/content/audiences'
import { hero, type HeroAction, type HeroContent } from '@/content/hero'
import { products, type Product } from '@/content/products'
import type { RoadmapContent, RoadmapStep } from '@/content/roadmap'
import { team, type TeamMember } from '@/content/team'
import { solution, type Benefit, type SolutionContent } from '@/content/solution'

describe('content types: expected errors', () => {
  it('rejects a button link that is not an in-page anchor', () => {
    // @ts-expect-error: href must start with "#"
    const external: HeroAction = { label: 'Work with us', href: 'https://example.com' }

    // @ts-expect-error: href must start with "#"
    const bare: HeroAction = { label: 'Contact', href: 'contact' }

    expectTypeOf(external).toEqualTypeOf<HeroAction>()
    expectTypeOf(bare).toEqualTypeOf<HeroAction>()
  })

  it('rejects a button without a label', () => {
    // @ts-expect-error: label is required
    const action: HeroAction = { href: '#contact' }

    expectTypeOf(action).toEqualTypeOf<HeroAction>()
  })

  it('rejects hero content without a tagline', () => {
    // @ts-expect-error: tagline is required
    const content: HeroContent = { companyName: 'CelyMary Greener Precast Blocks', actions: [] }

    expectTypeOf(content).toEqualTypeOf<HeroContent>()
  })

  it('rejects a benefit without a description', () => {
    // @ts-expect-error: description is required
    const benefit: Benefit = { title: 'Lower carbon' }

    expectTypeOf(benefit).toEqualTypeOf<Benefit>()
  })

  it('rejects a benefit with a number instead of text', () => {
    // @ts-expect-error: description must be a string
    const benefit: Benefit = { title: 'Lower carbon', description: 42 }

    expectTypeOf(benefit).toEqualTypeOf<Benefit>()
  })

  it('rejects a product with an icon that does not exist', () => {
    const product: Product = {
      id: 'test',
      name: 'Test block',
      description: 'Test use.',
      // @ts-expect-error: icon must be one of the drawn icons
      icon: 'brick',
    }

    expectTypeOf(product).toEqualTypeOf<Product>()
  })

  it('rejects a product without a description', () => {
    // @ts-expect-error: description is required
    const product: Product = { id: 'test', name: 'Test block', icon: 'paving' }

    expectTypeOf(product).toEqualTypeOf<Product>()
  })

  it('rejects an audience without a description', () => {
    // @ts-expect-error: description is required
    const audience: Audience = { id: 'test', title: 'For test' }

    expectTypeOf(audience).toEqualTypeOf<Audience>()
  })

  it('rejects a roadmap without steps', () => {
    // @ts-expect-error: steps is required
    const content: RoadmapContent = { heading: 'Test', statement: 'Test.' }

    expectTypeOf(content).toEqualTypeOf<RoadmapContent>()
  })

  it('rejects a roadmap step without a title, but allows no label or note', () => {
    // @ts-expect-error: title is required
    const invalid: RoadmapStep = { id: 'test' }
    const minimal: RoadmapStep = { id: 'test', title: 'Test step' }

    expectTypeOf(invalid).toEqualTypeOf<RoadmapStep>()
    expectTypeOf(minimal).toEqualTypeOf<RoadmapStep>()
  })

  it('rejects a team member without a bio', () => {
    // @ts-expect-error: bio is required
    const member: TeamMember = { name: 'Test name', role: 'Test role' }

    expectTypeOf(member).toEqualTypeOf<TeamMember>()
  })

  it('does not allow adding team members from code at runtime', () => {
    // @ts-expect-error: members is read-only
    team.members.push({ name: 'X', role: 'X', bio: 'X.' })

    expectTypeOf(team.members).toEqualTypeOf<readonly TeamMember[]>()
  })

  it('does not allow adding products from code at runtime', () => {
    // @ts-expect-error: items is read-only
    products.items.push({ id: 'x', name: 'X', description: 'X.', icon: 'paving' })

    expectTypeOf(products.items).toEqualTypeOf<readonly Product[]>()
  })

  it('does not allow adding buttons or benefits from code at runtime', () => {
    // @ts-expect-error: actions is read-only
    hero.actions.push({ label: 'Extra', href: '#extra' })

    // @ts-expect-error: benefits is read-only
    solution.benefits.push({ title: 'Extra', description: 'Extra.' })

    expectTypeOf(solution).toEqualTypeOf<SolutionContent>()
  })
})
