import React, { useState } from 'react';
import { useStateContext } from '../context/ContextProvider';
import { Tooltip, Button, Menu, MenuButton, MenuItem, MenuList, useColorMode,MenuDivider } from '@chakra-ui/react';
import { TbLayoutSidebar } from 'react-icons/tb';
import { FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdDarkMode, MdOutlineImage, MdOutlineLightMode } from 'react-icons/md';
import { zoomOptions } from '../data/viewerData';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import { IoMdCheckmark } from 'react-icons/io';

const ToolbarBtn = ({ icon, canActive, title, handleClick, initStatus, className }) => {
  const [isActive, setIsActive] = useState(initStatus || false);
  return (
    <Tooltip label={title} hasArrow fontSize="small">
      <span className={className}>
        <button
          type='button'
          onClick={() => {
            if(canActive) {
              setIsActive(prev => !prev);
            }
            if(handleClick) {
              handleClick();
            }
          }}
          className={`hover:bg-active-color hover:dark:bg-gray-500 hover:text-active-color text-text-color dark:text-white h-9 w-9 rounded-md active:scale-95 transition-all  ${isActive ? 'bg-active-color text-active-color dark:text-text-color dark:hover:text-white' : ''} `}
          aria-label={title}
        >
          <span className='flex align-middle justify-center text-xl'>{icon}</span>
        </button>
      </span>
    </Tooltip>
  )
}

const qualityOptions = [
  { label: "Low", tag: null, value: 1 },
  { label: "Normal", tag: null, value: 2 },
  { label: "High", tag: null, value: 3 },
];


const Header = () => {
  const { currentMode, scale, setMode, setActiveThumbnailes, activeThumbnailes, pdfQuality, setPdfQuality, handleRotateLeft, handleRotateRight, handleZoomIn, handleZoomOut, setZoom, setScaleByParentWidth } = useStateContext();
  const { toggleColorMode } = useColorMode();
  const [isShowTools, setIsShowTools] = useState(true);




  const ViewerTools = () => (
    <div className='flex items-center gap-1'>
      <div className='max-md:hidden'>
        <ToolbarBtn
          icon={<FiRotateCcw />}
          title="Rotate Counterclockwise"
          handleClick={handleRotateLeft}
        />
        <ToolbarBtn
          icon={<FiRotateCw />}
          title="Rotate Clockwise"
          handleClick={handleRotateRight}
          className="mr-2"
        />
      </div>
      <ToolbarBtn
        icon={<FiZoomOut />}
        title="Zoom Out"
        handleClick={handleZoomOut}
      />
      <Menu>
        <Tooltip label="Select Zoom">
          <MenuButton as={Button} bg="transparent" rightIcon={<BiChevronDown />}>
            {Math.round(scale*100)}%
          </MenuButton>
        </Tooltip>
        <MenuList>
          <MenuItem onClick={() => setZoom(setScaleByParentWidth())}>Fit to width</MenuItem>
          {/* <MenuItem>Fit to hight</MenuItem> */}
          <MenuDivider />
          {zoomOptions.map((item, i) => (
            <MenuItem key={i} command={scale === item.value ? <IoMdCheckmark /> : ""} onClick={() => setZoom(item.value)}>{item.label}</MenuItem>
          ))}
        </MenuList>
      </Menu>
      <ToolbarBtn
        icon={<FiZoomIn />}
        title="Zoom In"
        handleClick={handleZoomIn}
      />
      <Menu>
        <Tooltip label="Render Quality">
          <MenuButton as={Button} bg="transparent" rightIcon={<BiChevronDown />}>
            <span className='text-text-color dark:text-white text-2xl'>
              <MdOutlineImage />
            </span>
          </MenuButton>
        </Tooltip>
        <MenuList>
          {qualityOptions?.map((item, i) => (
            <MenuItem key={i} onClick={() => setPdfQuality(item.value)} command={pdfQuality == item.value ? <IoMdCheckmark /> : null}>
              <span className={pdfQuality === item.value ? "font-semibold" : ""}>{item?.label} <span className='text-sm opacity-25'>{item.tag}</span></span>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );




  return (
    <header className='fixed top-0 w-full border-b-2 border-gray-200 dark:border-gray-800 z-10 h-14 md:h-14 max-md:h-[9vh] max-md:relative'>
      <div className='flex justify-between w-full h-full px-3 py-0 md:px-6 md:py-1 items-center bg-[#e7ebee] dark:bg-main-dark-bg overflow-x-auto hide-scrollbar'>
        <div className='flex items-center gap-2'>
          <ToolbarBtn
            icon={<TbLayoutSidebar />}
            title="Panel"
            handleClick={() => setActiveThumbnailes(prev => !prev)}
            canActive
            initStatus={activeThumbnailes}
          />
          <div className='flex items-center md:hidden mr-4'>
            <Button
              size="sm"
              colorScheme="blue" variant="solid"
              mr={2} padding={0}
              onClick={() => setIsShowTools(prev => !prev)}
            >
              {isShowTools ? <RiArrowLeftSLine /> : <RiArrowRightSLine />}
            </Button>
            {isShowTools ? <ViewerTools /> : null}
          </div>
        </div>
        <div className='hidden md:flex'>
          {/* <img src={logo} alt="logo" className="hidden md:block" style={{ height: 30, filter: currentMode === "dark" ? "grayscale(1) invert(1)" : "" }} /> */}
          <div className='flex items-center gap-2'>
            <ViewerTools />
          </div>
        </div>
        <ToolbarBtn
          icon={currentMode === "dark" ? <MdDarkMode /> : <MdOutlineLightMode />}
          title={`Switch To ${currentMode === "dark" ? "Light" : "Dark"} Mode`}
          handleClick={() => {
            setMode(currentMode === "dark" ? "light" : "dark");
            toggleColorMode();
          }}
        />
      </div>
    </header>
  )
}

export default Header