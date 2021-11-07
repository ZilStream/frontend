import React, { ChangeEventHandler, useEffect, useState } from 'react'
import { X } from 'react-feather'

interface Props {
  selected: boolean
  onChange?: (() => void)
  children: React.ReactNode
}

const ToggleButton = (props: Props) => {
  const { selected, children } = props
  const [isSelected, setIsSelected] = useState<boolean>(props.selected)
  const [initialized, setInitialized] = useState<boolean>(false)

  useEffect(() => {
    if(!initialized) {
      setInitialized(true)
    } else {
      props.onChange?.()
    }
  }, [isSelected])

  return (
    <button className={isSelected ? 'toggle-btn-selected' : 'toggle-btn'} onClick={() => setIsSelected(!isSelected)}>
      {children}
      {isSelected &&
        <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center ml-1"><X size={14} /></span>
      }
    </button>
  )
}

export default ToggleButton