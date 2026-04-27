import React, { useState, useEffect } from "react";

function Counter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += Math.ceil(target / 60);
      if (start < target) {
        setCount(start);
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    step();
  }, [target]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Metrics() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl mb-10 font-bold">
        Trusted by Growing Businesses
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-4xl text-emerald-500">
            <Counter target={1200} />+
          </h3>
          <p>Shops</p>
        </div>

        <div>
          <h3 className="text-4xl text-emerald-500">
            ₦<Counter target={3400000000} />
          </h3>
          <p>Sales</p>
        </div>

        <div>
          <h3 className="text-4xl text-emerald-500">
            <Counter target={8500} />+
          </h3>
          <p>Transactions</p>
        </div>
      </div>
    </section>
  );
}