import React from 'react'

function Overview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-4 gap-6">
        {[
          {title: "Total Sales", value: "$15,200"},
          {title: "Products in Stock", value: "436"},
          {title: "Active Customers", value: "200"},
          {title: "Suppliers", value: "15"},
        ].map((stat)=> (
        <div 
          key={stat.title}
          className="bg-white p-4 rounded-lg shadow"
        >
          <h2 className="text-sm text-gray-500">{stat.title}</h2>
          <p className="text-2xl font-semibold text-dark mt-1">{stat.value}</p>
        </div>
        ))
        }
      </div>
    </div>
  )
}

export default Overview