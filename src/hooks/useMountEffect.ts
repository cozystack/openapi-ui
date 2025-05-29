import { useEffect, useRef, DependencyList, EffectCallback } from 'react'

export const useMountEffect = (fn: EffectCallback, deps: DependencyList) => {
  const isMount = useRef(true)
  const fnRef = useRef<EffectCallback>(fn)
  fnRef.current = fn

  useEffect(() => {
    if (isMount.current) {
      isMount.current = false

      return undefined
    }

    return fnRef.current()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
