import React from 'react'

function AuthForm({
  onSubmit,
  children,
  submitText = 'Отправить',
  isLoading = false
}) {
  return (
    <form className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-sm border" onSubmit={onSubmit}>
      <div className="space-y-4">
        {children}
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Загрузка...
            </div>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  )
}

export default AuthForm