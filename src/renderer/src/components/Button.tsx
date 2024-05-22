interface IButton {
  label: string
  type?: 'button' | 'submit' | 'reset'
  style?: string
}

const Button = ({ label, type = 'button', style }: IButton): JSX.Element => {
  return (
    <button type={type} className={`${style}`} style={{ cursor: 'pointer' }}>
      {label}
    </button>
  )
}

export default Button
