export default function Checkbox({ value = null, checked, onChange, label }) {
  const valSpaceless = value?.replace(/\s/g, "");

  return (
    <div className="checkbox">
      <input
        class="form-check-input"
        type="checkbox"
        value={value}
        id={`checkbox-${valSpaceless}`}
        checked={checked}
        onChange={onChange}
      />
      <label class="form-check-label" for={`checkbox-${valSpaceless}`}>
        {label}
      </label>
    </div>
  );
}
