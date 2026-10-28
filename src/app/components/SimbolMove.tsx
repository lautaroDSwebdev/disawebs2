import React from "react";

const SimbolMove = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="card-6" aria-hidden="true">
      <div className="card-6__holo">
        <div className="card-6__layer card-6__layer--back">{ children }</div>
        <div className="card-6__layer card-6__layer--mid">{ children }</div>
        <div className="card-6__layer card-6__layer--front">{ children }</div>
      </div>
    </div>
  );
};

export default SimbolMove;
