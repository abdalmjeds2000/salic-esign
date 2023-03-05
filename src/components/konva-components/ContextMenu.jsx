import React, { memo } from "react";
import ReactDOM from "react-dom";

const ContextMenu = (props) => {
  return (
    ReactDOM.createPortal(
      <div
        className="py-2 rounded-lg absolute bg-white flex gap-1 z-50"
        style={{
          left: props.x || 0,
          top: props.y || 0,
        }}
      >
        {props.children}
      </div>,
      document.getElementById("portals-content")
    )
  );
};

export default memo(ContextMenu);