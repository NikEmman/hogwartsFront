import React from "react";

function SpinningWheel({ size = 40, text = "" }) {
  return (
    <div className={`spinning-wheel-container `}>
      <div
        className="spinning-wheel"
        style={{
          width: size,
          height: size,
        }}
      />
      {text && <p className="spinning-wheel-text">{text}</p>}
    </div>
  );
}

export default SpinningWheel;
