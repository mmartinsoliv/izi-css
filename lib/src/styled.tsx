import * as React from 'react'

import type {
  VariantsDefinition,
  DefaultVariants,
  VariantsConfig,
} from './types'
import { createVariantsMapper } from './utilities'

type AnyComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>

export function styled<T extends VariantsDefinition, C extends AnyComponent>(
  baseComponent: C,
  config: VariantsConfig<T>,
) {
  const getClasses = createVariantsMapper(config)

  const PolymorphicComponent: any = baseComponent
  const ComponentWithVariantsProps = React.forwardRef<
    React.ElementRef<C>,
    React.ComponentProps<C> & {
      variants?: DefaultVariants<T>
    }
  >(({ className, variants, ...props }, forwardedRef) => (
    <PolymorphicComponent
      className={
        getClasses({
          ...variants,
          className,
        }) || undefined
      }
      {...props}
      ref={forwardedRef}
    />
  ))

  if (
    typeof baseComponent === 'string' &&
    !ComponentWithVariantsProps.displayName
  )
    ComponentWithVariantsProps.displayName = baseComponent

  return ComponentWithVariantsProps
}
