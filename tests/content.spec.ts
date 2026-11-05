import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '@/App.vue'
import { hero } from '@/content/hero'
import { solution } from '@/content/solution'

const allTexts = [
  hero.companyName,
  hero.tagline,
  ...hero.actions.map((action) => action.label),
  solution.heading,
  ...solution.benefits.flatMap((benefit) => [benefit.title, benefit.description]),
]

describe('site content', () => {
  describe('normal cases', () => {
    it('hero has exactly the two buttons from the acceptance criteria', () => {
      expect(hero.actions.map((action) => action.label)).toEqual(['Work with us', 'Contact'])
    })

    it('solution has exactly the three benefits from the acceptance criteria', () => {
      expect(solution.benefits.map((benefit) => benefit.title)).toEqual([
        'Lower carbon',
        'Recycled industrial materials',
        'Local production',
      ])
    })
  })

  describe('edge cases', () => {
    it('has no empty or whitespace-only texts', () => {
      for (const text of allTexts) {
        expect(text.trim()).not.toBe('')
      }
    })

    it('has no leading or trailing spaces in texts', () => {
      for (const text of allTexts) {
        expect(text).toBe(text.trim())
      }
    })

    it('uses in-page anchors with valid section ids for every button', () => {
      for (const action of hero.actions) {
        expect(action.href).toMatch(/^#[a-z][a-z0-9-]*$/)
      }
    })

    it('has unique button targets and benefit titles (they are used as list keys)', () => {
      const hrefs = hero.actions.map((action) => action.href)
      const titles = solution.benefits.map((benefit) => benefit.title)

      expect(new Set(hrefs).size).toBe(hrefs.length)
      expect(new Set(titles).size).toBe(titles.length)
    })

    it('keeps the tagline to one short line', () => {
      expect(hero.tagline.length).toBeLessThanOrEqual(80)
      expect(hero.tagline).not.toContain('\n')
    })
  })

  describe('confidentiality and honesty rules (CLAUDE.md)', () => {
    // Generic words only: listing actual materials here would itself reveal them.
    const forbiddenWords = [
      'recipe',
      'formula',
      'formulation',
      'ingredient',
      'composition',
      'mix design',
      'production process',
      'manufacturing process',
    ]

    it('never mentions recipes, formulations or the production process on the page', () => {
      const pageText = mount(App).text().toLowerCase()

      for (const word of forbiddenWords) {
        expect(pageText).not.toContain(word)
      }
    })

    it('contains no figures, so no unverified statistics', () => {
      const pageText = mount(App).text()

      expect(pageText).not.toMatch(/\d/)
    })
  })
})
