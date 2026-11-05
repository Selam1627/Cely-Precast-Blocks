import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '@/App.vue'

describe('App', () => {
  it('shows the hero section first, then "Our solution"', () => {
    const wrapper = mount(App)

    expect(wrapper.get('h1').text()).toBe('Cely Precast Greener Blocks')
    expect(wrapper.get('h2').text()).toBe('Our solution')
    expect(wrapper.html().indexOf('<h1')).toBeLessThan(wrapper.html().indexOf('<h2'))
  })

  it('has a single main landmark and a single main heading', () => {
    const wrapper = mount(App)

    expect(wrapper.findAll('main')).toHaveLength(1)
    expect(wrapper.findAll('h1')).toHaveLength(1)
  })

  // Expected to fail until US-03 (#work-with-us) and US-04 (#contact) exist, as
  // agreed for this feature. Once both sections are built, Vitest will report
  // this test as failing because it passes: then change `it.fails` to `it`.
  it.fails('every hero button points to a section that exists on the page', () => {
    const wrapper = mount(App)

    for (const link of wrapper.findAll('section a[href^="#"]')) {
      const targetId = link.attributes('href')!.slice(1)
      expect(wrapper.find(`[id="${targetId}"]`).exists()).toBe(true)
    }
  })
})
