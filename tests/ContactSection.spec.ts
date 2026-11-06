import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ContactSection from '@/components/sections/ContactSection.vue'
import { contact } from '@/content/contact'
import { products } from '@/content/products'
import { openEmail } from '@/utils/contactForm'

// Keep the real validation and link building; only opening the email app is faked.
vi.mock('@/utils/contactForm', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/contactForm')>()),
  openEmail: vi.fn(),
}))

const testAddress = 'contact@example.com'

/** Mounted on the page, because moving keyboard focus needs a real document. */
function mountForm() {
  return mount(ContactSection, { attachTo: document.body })
}

type Wrapper = ReturnType<typeof mountForm>

async function fillInRequiredFields(wrapper: Wrapper) {
  await wrapper.get('#contact-name').setValue('Test Visitor')
  await wrapper.get('#contact-email').setValue('visitor@example.com')
  await wrapper.get('#contact-visitor-type').setValue('Architect')
  await wrapper.get('#contact-message').setValue('Test message.')
}

async function submit(wrapper: Wrapper) {
  await wrapper.get('form').trigger('submit')
  await wrapper.vm.$nextTick()
}

function optionsOf(wrapper: Wrapper, selector: string) {
  return wrapper.get(selector).findAll('option')
}

beforeEach(() => {
  vi.stubEnv('VITE_CONTACT_EMAIL', testAddress)
  vi.mocked(openEmail).mockClear()
})

afterEach(() => {
  vi.unstubAllEnvs()
  document.body.innerHTML = ''
})

describe('ContactSection', () => {
  describe('normal cases', () => {
    it('can be reached at #contact and is labelled by the "Contact us" heading', () => {
      const wrapper = mountForm()
      const section = wrapper.get('section')

      expect(section.attributes('id')).toBe('contact')
      expect(wrapper.get(`#${section.attributes('aria-labelledby')}`).text()).toBe('Contact us')
    })

    it('has a label connected to every field', () => {
      const wrapper = mountForm()
      const fields = wrapper.findAll('input, select, textarea')

      expect(fields).toHaveLength(5)
      for (const field of fields) {
        const label = wrapper.get(`label[for="${field.attributes('id')}"]`)
        expect(label.text()).not.toBe('')
      }
    })

    it('offers the seven visitor types', () => {
      const wrapper = mountForm()

      const choices = optionsOf(wrapper, '#contact-visitor-type')
        .slice(1)
        .map((option) => option.text())

      expect(choices).toEqual([
        'Architect',
        'Engineer',
        'Builder',
        'Real estate developer',
        'Investor',
        'Partner',
        'Other',
      ])
    })

    it('offers the five products, plus the choice of none', () => {
      const wrapper = mountForm()
      const [none, ...choices] = optionsOf(wrapper, '#contact-product')

      expect(none!.text()).toBe('No specific product')
      expect(none!.attributes('value')).toBe('')
      expect(choices.map((option) => option.text())).toEqual(
        products.items.map((product) => product.name),
      )
    })

    it('opens one pre-filled email to the configured address on submit', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await wrapper.get('#contact-product').setValue('Paving blocks')

      await submit(wrapper)

      expect(openEmail).toHaveBeenCalledTimes(1)
      const url = new URL(vi.mocked(openEmail).mock.calls[0]![0])
      expect(url.protocol).toBe('mailto:')
      expect(url.pathname).toBe(testAddress)
      expect(url.searchParams.get('subject')).toBe('Website enquiry from Test Visitor')
      expect(url.searchParams.get('body')).toContain('Visitor type: Architect')
      expect(url.searchParams.get('body')).toContain('Product of interest: Paving blocks')
      expect(url.searchParams.get('body')).toContain('Test message.')
    })

    it('opens the email without a product, because it is optional', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await submit(wrapper)

      expect(openEmail).toHaveBeenCalledTimes(1)
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('shows the address as a direct email link', () => {
      const wrapper = mountForm()
      const link = wrapper.get('form a')

      expect(link.attributes('href')).toBe(`mailto:${testAddress}`)
      expect(link.text()).toBe(testAddress)
      expect(link.element.parentElement!.textContent).toContain(
        `Or write to us directly at ${testAddress}`,
      )
    })
  })

  describe('expected errors', () => {
    it('shows no errors before the visitor presses Send', () => {
      expect(mountForm().find('[role="alert"]').exists()).toBe(false)
    })

    it('shows a clear error for each required field and opens no email', async () => {
      const wrapper = mountForm()

      await submit(wrapper)

      expect(wrapper.findAll('[role="alert"]').map((error) => error.text())).toEqual([
        'Please enter your name.',
        'Please enter your email address.',
        'Please select who you are.',
        'Please enter a message.',
      ])
      expect(openEmail).not.toHaveBeenCalled()
    })

    it('shows an error for a badly formatted email and opens no email', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await wrapper.get('#contact-email').setValue('not-an-email')

      await submit(wrapper)

      expect(wrapper.get('#contact-email-error').text()).toBe(
        'Please enter a valid email address, for example name@example.com.',
      )
      expect(openEmail).not.toHaveBeenCalled()
    })

    it.each([
      ['missing', undefined],
      ['empty', ''],
      ['only spaces', '   '],
    ])('shows the unavailable message when the address is %s', async (_case, address) => {
      vi.stubEnv('VITE_CONTACT_EMAIL', address as string)
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await submit(wrapper)

      expect(wrapper.get('[role="alert"]').text()).toBe(
        'The contact form is not available right now.',
      )
      expect(openEmail).not.toHaveBeenCalled()
      expect(wrapper.find('form a').exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Or write to us directly at')
    })

    it('asks for the fields first when the address is missing too', async () => {
      vi.stubEnv('VITE_CONTACT_EMAIL', '')
      const wrapper = mountForm()

      await submit(wrapper)

      expect(wrapper.text()).toContain('Please enter your name.')
      expect(wrapper.text()).not.toContain(contact.unavailableMessage)
    })
  })

  describe('edge cases', () => {
    it('moves keyboard focus to the first field with a problem', async () => {
      const wrapper = mountForm()
      await wrapper.get('#contact-name').setValue('Test Visitor')
      await wrapper.get('#contact-email').setValue('visitor@example.com')

      await submit(wrapper)

      expect(document.activeElement).toBe(wrapper.get('#contact-visitor-type').element)
    })

    it('connects each error to its field for screen readers', async () => {
      const wrapper = mountForm()

      await submit(wrapper)

      for (const id of [
        'contact-name',
        'contact-email',
        'contact-visitor-type',
        'contact-message',
      ]) {
        const field = wrapper.get(`#${id}`)
        expect(field.attributes('aria-invalid')).toBe('true')
        expect(field.attributes('aria-describedby')).toBe(`${id}-error`)
        expect(wrapper.find(`#${id}-error`).exists()).toBe(true)
      }
    })

    it('clears an error as soon as its field is fixed, leaving the others', async () => {
      const wrapper = mountForm()
      await submit(wrapper)

      await wrapper.get('#contact-name').setValue('Test Visitor')

      const name = wrapper.get('#contact-name')
      expect(wrapper.find('#contact-name-error').exists()).toBe(false)
      expect(name.attributes('aria-invalid')).toBeUndefined()
      expect(name.attributes('aria-describedby')).toBeUndefined()
      expect(wrapper.find('#contact-email-error').exists()).toBe(true)
    })

    it('updates the email error from "empty" to "invalid" while typing', async () => {
      const wrapper = mountForm()
      await submit(wrapper)

      await wrapper.get('#contact-email').setValue('name@')

      expect(wrapper.get('#contact-email-error').text()).toBe(contact.errors.emailInvalid)
    })

    it('does not show errors on other fields while the visitor types', async () => {
      const wrapper = mountForm()

      await wrapper.get('#contact-name').setValue('Test Visitor')
      await wrapper.get('#contact-email').setValue('name@')

      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('rejects a message of only spaces', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)
      await wrapper.get('#contact-message').setValue('   ')

      await submit(wrapper)

      expect(wrapper.get('#contact-message-error').text()).toBe('Please enter a message.')
      expect(openEmail).not.toHaveBeenCalled()
    })

    it('keeps what the visitor wrote after opening the email', async () => {
      const wrapper = mountForm()
      await fillInRequiredFields(wrapper)

      await submit(wrapper)

      const message = wrapper.get('#contact-message').element as HTMLTextAreaElement
      expect(message.value).toBe('Test message.')
    })

    it('submits with a real button, so Enter and the keyboard work', () => {
      const wrapper = mountForm()
      const button = wrapper.get('form button')

      expect(button.attributes('type')).toBe('submit')
      expect(button.text()).toBe('Send message')
    })

    it('leaves the checking to the form, not the browser pop-ups', () => {
      expect(mountForm().get('form').attributes('novalidate')).toBeDefined()
    })

    it('marks only the required fields as required', () => {
      const wrapper = mountForm()

      for (const id of [
        'contact-name',
        'contact-email',
        'contact-visitor-type',
        'contact-message',
      ]) {
        expect(wrapper.get(`#${id}`).attributes('required')).toBeDefined()
      }
      expect(wrapper.get('#contact-product').attributes('required')).toBeUndefined()
    })

    it('helps phones: email keyboard, autofill, and text large enough not to zoom', () => {
      const wrapper = mountForm()
      const email = wrapper.get('#contact-email')

      expect(email.attributes('type')).toBe('email')
      expect(email.attributes('autocomplete')).toBe('email')
      expect(wrapper.get('#contact-name').attributes('autocomplete')).toBe('name')
      for (const field of wrapper.findAll('input, select, textarea')) {
        expect(field.classes()).toContain('text-base')
        expect(field.classes()).toContain('min-h-11')
      }
    })

    it('does not let the visitor pick the visitor-type prompt as an answer', () => {
      const [prompt] = optionsOf(mountForm(), '#contact-visitor-type')

      expect(prompt!.text()).toBe('Select one')
      expect(prompt!.attributes('disabled')).toBeDefined()
    })
  })
})
