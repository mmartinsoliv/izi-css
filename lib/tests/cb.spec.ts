import { describe, test, expect } from 'vitest'
import { cb } from '../src'

const getClasses = cb({
    base: 'base',
    variants: {
      size: { small: 'sm', medium: 'md', large: 'lg' },
      color: { red: 'red', green: 'green', blue: 'blue' },
    },
    defaultVariants: {
      color: 'red',
    },
    compoundVariants: [{ color: 'blue', className: 'compound' }],
})

describe('Class Builder', () => {
    test('the builder returns a function', () => {
        expect(typeof getClasses).toBe('function')
    })
})

describe('Props to Classes', () => {
    test('props should be optional', () => {
        const classes = getClasses()
        expect(classes).toBe('base red')
    })

    test('support empty object literal', () => {
      const classes = getClasses({})
      expect(classes).toBe('base red')
    })

    test('support a single variant', () => {
      const classes = getClasses({ color: 'green' })
      expect(classes).toBe('base green')
    })

    test('support a multiple variants', () => {
      const classes = getClasses({ color: 'green', size: 'large' })
      expect(classes).toBe('base green lg')
    })

    test('support compound variants with single property', () => {
      const classes = getClasses({ color: 'blue' })
      expect(classes).toBe('base blue compound')
    })

    test('support compound variants with multiple properties', () => {
      const classes = getClasses({ color: 'blue', size: 'large' })
      expect(classes).toBe('base blue lg compound')
    })

    test('append with "className" prop', () => {
       const classes = getClasses({
         color: 'blue',
         size: 'large',
         className: 'suffix',
       })
       expect(classes).toBe('base blue lg compound suffix')
    })

    test('support base without variants', () => {
        expect(cb({ base: 'a' })()).toBe('a')
    })
    
    test('compound variants need to match all properties to apply', () => {
        const getClasses = cb({
          variants: { a: { 1: '1', 2: '2' }, b: { 3: '3', 4: '4' } },
          compoundVariants: [{ a: 1, b: 3, className: 'compound' }],
        })
    
        expect(getClasses({ a: 1, b: 3 }).endsWith('compound'))
        expect(getClasses({ a: 1, b: 4 }).endsWith('compound')).toBe(false)
    
        expect(getClasses({ a: 1, b: 3, className: 'suffix' }).endsWith('suffix'))
    })

    describe('Edge cases', () => {
      test('`className` inside `variants` kills `compoundVariants`', () => {
        const getClasses = cb({
          base: 'base',
          variants: {
            className: { foo: 'bar', john: 'doe' },
          },
          defaultVariants: {
            className: 'john',
          },
          // There's no way to provide a `className`
          // other than 'john' due in this case 👇🏻
          compoundVariants: [{ className: 'john' }],
        })
  
        const classes = getClasses()
        expect(classes).toBe('base doe john')
      })
    })
})