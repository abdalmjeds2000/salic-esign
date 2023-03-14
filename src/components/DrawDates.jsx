import React, { memo } from 'react';
import { Text } from 'react-konva';
import { useStateContext } from '../context/ContextProvider';



const DrawDates = ({ pageNumber }) => {
  const { datesList, onDateItemContextMenu } = useStateContext();

  return (
    <>
      {
        datesList?.map((date, i) => {
          if(pageNumber === date.page) {
            return (
              <Text
                key={i} 
                {...date}
                text={date.dateText}
                align="center"
                fontSize={14}
                _id={date._id}
                onContextMenu={onDateItemContextMenu}
                onDblTap={onDateItemContextMenu}
              />
            )
          }
          return <></>
        })
      }
    </>
  )
};
export default memo(DrawDates)