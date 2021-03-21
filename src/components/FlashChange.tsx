import React from 'react'

interface Props {
  value: number
  flashDuration: number
}

interface State {
  isFlashing: boolean
  isPositive: boolean
  props: Props
}

class FlashChange extends React.Component<Props, State> {
  static defaultProps = {
    flashDuration: 2000
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      isFlashing: false,
      isPositive: false,
      props: props,
    }
  }

  _timer: ReturnType<typeof setTimeout>|null = null

  _deactivateTimer = () => {
    this.setState({
      isFlashing: false
    })
  }

  _activateTimer() {
    const { flashDuration } = this.props

    this._timer = setTimeout(this._deactivateTimer, flashDuration)
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    let prevValue = prevState.props.value
    let nextValue = nextProps.value

    if(nextValue > prevValue) {
      return { isFlashing: true, isPositive: true, props: nextProps }
    } else if(prevValue > nextValue) {
      return { isFlashing: true, isPositive: false, props: nextProps }
    }

    return { props: nextProps }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(this.state.isFlashing) {
      this._activateTimer()
    }
  }

  componentWillUnmount() {
    if(this._timer) {
      clearTimeout(this._timer)
    }
  }

  render() {
    const { children } = this.props
    const { isFlashing, isPositive } = this.state

    var classes = ''
    if(isFlashing && isPositive) {
      classes = 'text-green-500'
    } else if(isFlashing && !isPositive) {
      classes = 'text-red-500'
    }

    return (
      <span className={`transition ${classes}`}>
        {children}
      </span>
    )
  }
}

export default FlashChange