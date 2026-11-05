import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '@/App.vue'

describe('App', () => {
  it('shows the company name as the main heading', () => {
    const wrapper = mount(App)

    expect(wrapper.get('h1').text()).toBe('Cely Precast Greener Blocks')
  })
})
