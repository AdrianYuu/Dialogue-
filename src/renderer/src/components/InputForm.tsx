interface IInputForm {
  label: string
  type: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  disabled?: boolean
}

const InputForm = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  disabled
}: IInputForm): JSX.Element => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text text-white text-sm">{label}</span>
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="input input-bordered"
      />
    </label>
  )
}

export default InputForm
