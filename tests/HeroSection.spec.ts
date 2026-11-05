import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import HeroSection from '@/components/sections/HeroSection.vue'
import { hero, type HeroContent } from '@/content/hero'

/** Mounts HeroSection with a replacement for src/content/hero.ts. */
async function mountWithContent(content: HeroContent) {
  vi.resetModules()
  vi.doMock('@/content/hero', () => ({ hero: content }))
  const { default: Component } = await import('@/components/sections/HeroSection.vue')
  return mount(Component)
}

afterEach(() => {
  vi.doUnmock('@/content/hero')
  vi.resetModules()
})

describe('HeroSection', () => {
  describe('normal cases', () => {
    it('shows the company name as the main heading', () => {
      const wrapper = mount(HeroSection)

      expect(wrapper.get('h1').text()).toBe('Cely Precast Greener Blocks')
    })

    it('shows the tagline from the content file', () => {
      const wrapper = mount(HeroSection)

      expect(wrapper.text()).toContain(hero.tagline)
    })

    it('has "Work with us" and "Contact" buttons that link to their sections', () => {
      const wrapper = mount(HeroSection)

      const buttons = wrapper.findAll('a').map((link) => ({
        label: link.text(),
        href: link.attributes('href'),
      }))

      expect(buttons).toEqual([
        { label: 'Work with us', href: '#work-with-us' },
        { label: 'Contact', href: '#contact' },
      ])
    })
  })

  describe('edge cases', () => {
    it('has exactly one main heading', () => {
      const wrapper = mount(HeroSection)

      expect(wrapper.findAll('h1')).toHaveLength(1)
    })

    it('styles only the first button as the primary one', () => {
      const wrapper = mount(HeroSection)
      const [workWithUs, contact] = wrapper.findAll('a')

      expect(workWithUs!.classes()).toContain('bg-emerald-700')
      expect(contact!.classes()).not.toContain('bg-emerald-700')
      expect(contact!.classes()).toContain('border-emerald-700')
    })

    it('keeps visitors on the page: buttons do not open a new tab', () => {
      const wrapper = mount(HeroSection)

      for (const link of wrapper.findAll('a')) {
        expect(link.attributes('target')).toBeUndefined()
      }
    })

    it('stacks the buttons on phones and puts them in a row from the sm breakpoint', () => {
      const wrapper = mount(HeroSection)
      const buttonRow = wrapper.get('a').element.parentElement!

      expect(buttonRow.classList).toContain('flex-col')
      expect(buttonRow.classList).toContain('sm:flex-row')
    })

    it('renders the text from the content file, not hard-coded text', async () => {
      const wrapper = await mountWithContent({
        companyName: 'Test Company',
        tagline: 'Test tagline.',
        actions: [{ label: 'Test action', href: '#test' }],
      })

      expect(wrapper.get('h1').text()).toBe('Test Company')
      expect(wrapper.text()).toContain('Test tagline.')
      expect(wrapper.get('a').attributes('href')).toBe('#test')
    })

    it('renders no buttons when the content file lists no actions', async () => {
      const wrapper = await mountWithContent({ ...hero, actions: [] })

      expect(wrapper.findAll('a')).toHaveLength(0)
      expect(wrapper.get('h1').text()).toBe(hero.companyName)
    })

    it('styles every action after the first as secondary', async () => {
      const wrapper = await mountWithContent({
        ...hero,
        actions: [...hero.actions, { label: 'Third', href: '#third' }],
      })
      const third = wrapper.findAll('a')[2]!

      expect(third.classes()).not.toContain('bg-emerald-700')
      expect(third.classes()).toContain('border-emerald-700')
    })
  })
})
