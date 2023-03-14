import React, { memo } from 'react';
import { Group, Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const URLImage = function URLImage(props) {
  const { _id, src, shapeProps, isSelected, onSelect, onChange, onClick, onTap } = props;
  const [img] = useImage(src);
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // const shapeX = shapeRef?.current?.attrs?.x + (shapeRef?.current?.attrs?.width * shapeRef?.current?.attrs?.scaleX) || 0 || 0;
  // const shapeY = shapeRef?.current?.attrs?.y || 0;

  const minX = 260;
  const minY = 1000;
  const maxX = 300;
  const maxY = 1020;

  // const handleDragBound = (pos) => {
  //   const rectNode = shapeRef.current;

  //   // Define the limits of the draggable area
  //   //UP 

  //   // Get the current scale of the shape
  //   const scaleX = rectNode?.scaleX() || 0;
  //   const scaleY = rectNode?.scaleY() || 0;

  //   // Calculate the scaled width and height of the shape
  //   const scaledWidth = rectNode?.width() || 0 * scaleX;
  //   const scaledHeight = rectNode?.height() || 0 * scaleY;

  //   // Limit the position of the draggable element within the defined limits
  //   const newRightX = pos.x + scaledWidth;
  //   const newBottomY = pos.y + scaledHeight;

  //   const newX = Math.max(minX, Math.min(pos.x, maxX - scaledWidth));
  //   const newY = Math.max(minY, Math.min(pos.y, maxY - scaledHeight));

  //   const newRightBoundX = Math.max(minX + scaledWidth, Math.min(newRightX, maxX));
  //   const newBottomBoundY = Math.max(minY + scaledHeight, Math.min(newBottomY, maxY));

  //   const newWidth = newRightBoundX - newX;
  //   const newHeight = newBottomBoundY - newY;

  //   return {
  //     x: newX,
  //     y: newY,
  //     width: newWidth / scaleX,
  //     height: newHeight / scaleY
  //   };
  // };

  return (
    <React.Fragment>
      <Group>
        <Image
          _id={_id}
          image={img}
          draggable
          ref={shapeRef}
          // dragBoundFunc={handleDragBound}
          onClick={(e) => {
            if(onSelect) onSelect();
            if(onClick) onClick(e);
          }}
          onTap={(e) => {
            if(onSelect) onSelect();
            if(onTap) onTap(e);
          }}
          perfectDrawEnabled={false}
          shadowBlur={5}
          shadowOffsetY={3}
          shadowColor={"#00000025"}
          {...shapeProps}
          // onTransformEnd={(e) => {
          //   const node = shapeRef.current;
          //   const scaleX = node.scaleX();
          //   const scaleY = node.scaleY();
          //   onChange({
          //     // ...node.attrs,
          //     x: node.x(),
          //     y: node.y(),
          //     width: node.width(),
          //     height: node.height(),
          //     scaleX: scaleX,
          //     scaleY: scaleY,
          //     rotation: node.attrs.rotation,
          //     draggable: node.attrs.draggable,
          //     // signPaths: node.attrs.draggable || null,
          //     type: node.attrs.type,
          //   });
          // }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            keepRatio={false}
            rotateAnchorOffset={25}
            anchorSize={10}
            anchorCornerRadius={2}
            borderStroke="#4466ff"
            anchorStroke='#4466ff'
            anchorStrokeWidth={2}
            borderStrokeWidth={2}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 25 || newBox.height < 25) {
                return oldBox;
              }
              // return newBox;
              return oldBox; // to prevent scale
            }}
          />
        )}
      </Group>
    </React.Fragment>
  );
}

export default memo(URLImage);