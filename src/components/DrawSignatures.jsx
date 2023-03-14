import React, { memo } from 'react';
import { useStateContext } from '../context/ContextProvider';
import URLImage from '../components/konva-components/URLImage';

const DrawSignatures = ({ pageNumber }) => {
  const { signatures, setSignatures, selectedId, selectShape, onContextMenu, setShowContextMenu, setNewSignAttrs, onOpen } = useStateContext();

  const handleDragEnd = (e) => {
    const updatedSignatures = signatures?.map(item => {
      if(item._id === e.target.attrs._id) {
        // item = {...item, ...e.target.attrs}
        item = {...item, x: e.target.attrs.x, y: e.target.attrs.y}
        selectShape(item._id);
        setShowContextMenu(false);
      }
      return item;
    });
    setSignatures(updatedSignatures);
  }
  
  return (
    <>
      {
        signatures?.map((item, i) => {
          if(pageNumber === item.page) {
            return (
              <URLImage 
                key={item._id} 
                _id={item._id}
                src={item.originalImage || item.imageData}
                shapeProps={{
                  ...item,
                  draggable: false,
                  onDragEnd: handleDragEnd,
                  onContextMenu: onContextMenu,
                  onDblTap: onContextMenu,
                  shadowEnabled: item.originalImage ? false : true,
                }}
                isSelected={item._id === selectedId}
                onSelect={() => {
                  if(item.originalImage) {
                    selectShape(item._id);
                  } else {
                    setNewSignAttrs(item);
                    onOpen();
                    selectShape(null);
                  }
                }}
                // onChange={(newAttrs) => {
                //   const rects = signatures.slice();
                //   rects[i] = {...rects[i], ...newAttrs};
                //   setSignatures(rects);
                // }}
              />
            )
          }
        })
      }
    </>
  )
};


export default memo(DrawSignatures)