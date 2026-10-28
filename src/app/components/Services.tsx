import React from "react";
import { siteData } from "../const/data";

const Services = () => {
  const angleStep = 360 / siteData.services.items.length;
  const radius = 200;
  return (
    <div>
      <div className="card-3d">
        {siteData.services.items.map((item, index) => {
          const angle = index * angleStep;
          const delay = -index * (20 / siteData.services.items.length);

          return (
            <div
              key={index}
              style={
                {
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                  animationDelay: `${delay}s`,
                } as React.CSSProperties
              }
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
