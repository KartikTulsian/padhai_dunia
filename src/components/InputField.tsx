import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  register: any;
  error?: FieldError;
  placeholder?: string;
  as?: "input" | "select" | "textarea";
  children?: React.ReactNode;
  defaultValue?: string;
  rows?: number; // <-- Add this
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  name,
  type = "text",
  register,
  error,
  placeholder,
  as = "input",
  children,
  defaultValue,
  rows, // <-- Receive it
  inputProps,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </label>

      {as === "select" ? (
        <select
          {...register(name, { valueAsNumber: type === "number" })}
          className={`ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            error ? "ring-red-400" : ""
          }`}
          defaultValue={defaultValue}
        >
          {children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          rows={rows} // <-- Properly applied here
          className={`ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            error ? "ring-red-400" : ""
          }`}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          type={type}
          {...register(name, { valueAsNumber: type === "number" })}
          placeholder={placeholder}
          className={`ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            error ? "ring-red-400" : ""
          }`}
          defaultValue={defaultValue}
          {...inputProps}
        />
      )}

      {error?.message && (
        <p className="text-xs text-red-500 mt-1 font-medium">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
