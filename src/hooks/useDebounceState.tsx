import { debounce } from 'lodash'
import { useRef, useState } from 'react'

type Props = {
  delay?: number
} | undefined

const defautDelay = 1000

export const useDebounceState = (props?: Props) => {
  const delay = props?.delay || defautDelay
  const [value, setValue] = useState('')
  const [dbValue, setDbValue] = useState('') // would be an API call normally
  const [isDebounce, setIsDebounce] = useState(false)

  const debouncedSave = useRef(
    debounce(nextValue => {
      setIsDebounce(false)
      setDbValue(nextValue)
    }, delay),
  ).current

  const handleChange = (searchString: string) => {
    setIsDebounce(true)
    setValue(searchString)
    debouncedSave(searchString)
  }

  return {
    value,
    dbValue,
    handleChange,
    isDebounce,
  }
}
