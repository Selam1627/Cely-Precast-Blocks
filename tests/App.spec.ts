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

  it('shows the sections in order after the hero', () => {
    const wrapper = mount(App)

    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual([
      'Our solution',
      'Our planned products',
      'Work with us',
      'Stage and roadmap',
      'Team',
    ])
  })

  it('has a section for the "Work with us" button to scroll to', () => {
    const wrapper = mount(App)
    const button = wrapper.get('a[href="#work-with-us"]')

    expect(button.text()).toBe('Work with us')
    expect(wrapper.get('section#work-with-us').find('h2').text()).toBe('Work with us')
  })

  it('has a single main landmark and a single main heading', () => {
    const wrapper = mount(App)

    expect(wrapper.findAll('main')).toHaveLength(1)
    expect(wrapper.findAll('h1')).toHaveLength(1)
  })

  // Expected to fail until US-04 adds #contact. Once it exists, Vitest will report
  // this test as failing because it passes: then change `it.fails` to `it`.
  it.fails('every hero button points to a section that exists on the page', () => {
    const wrapper = mount(App)

    for (const link of wrapper.findAll('section a[href^="#"]')) {
      const targetId = link.attributes('href')!.slice(1)
      expect(wrapper.find(`[id="${targetId}"]`).exists()).toBe(true)
    }
  })
})
