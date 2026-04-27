import React from 'react'

function Spinner({fullScreen = false}) {
  return (
    <div
      className={`flex item-center justify-center ${
        fullScreen ? "h-screen" : "h-full"
      }`} 
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"/>
    </div>
  );
}

export default Spinner