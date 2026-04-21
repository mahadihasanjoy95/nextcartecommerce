import { useState } from 'react'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

function InputField({ label, error, hint, type = 'text', className = '', ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword && showPassword ? 'text' : type

  return (
    <div className={className}>
      {label && (
        <label className="block font-body text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={inputType}
          className={`w-full font-body text-sm px-4 py-3 rounded-xl border bg-white
                     transition-all duration-200 outline-none
                     placeholder:text-gray-400
                     ${error
                       ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                       : 'border-gray-200 focus:border-brand-pink-500 focus:ring-2 focus:ring-brand-pink-500/15'
                     }
                     ${isPassword ? 'pr-11' : ''}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400
                       hover:text-gray-600 transition-colors duration-150"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword
              ? <RiEyeOffLine className="w-5 h-5" />
              : <RiEyeLine    className="w-5 h-5" />
            }
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 font-body text-xs text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 font-body text-xs text-gray-400">{hint}</p>
      )}
    </div>
  )
}

export default InputField
