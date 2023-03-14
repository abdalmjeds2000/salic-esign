import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import Header from "../components/Header";
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import ToolsHeader from "../components/ToolsHeader";
import useOnScreen from "../hooks/useOnScreen";
import SignaturePad from "../components/signature-pad/SignaturePad";
import DrawDates from '../components/DrawDates';
import DrawSignatures from '../components/DrawSignatures';
import { Layer, Rect, Stage } from "react-konva";
import ContextMenu from "../components/konva-components/ContextMenu";
import { HiOutlineTrash } from "react-icons/hi";
import { CgArrowsExchange } from "react-icons/cg";
import { BiMessageAltDetail } from "react-icons/bi";
import signPlaceholder from "../assets/images/sign_placeholder.png";

  function SliderThumbs({ getSliderValue }) {
    const [sliderValue, setSliderValue] = React.useState(2);
    const [showTooltip, setShowTooltip] = React.useState(false);

    useEffect(() => {
      getSliderValue(sliderValue);
    }, [sliderValue]);

    
    return (
      <div className="my-3 mx-6">
        <Slider
          id='slider'
          defaultValue={sliderValue}
          min={1}
          max={3}
          step={1}
          onChange={setSliderValue}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <SliderTrack bg='white'>
            <SliderFilledTrack bg='blue.700' />
          </SliderTrack>
          <Tooltip
            placement='bottom'
            isOpen={showTooltip}
            label={sliderValue}
          >
            <SliderThumb boxSize={5} />
          </Tooltip>
        </Slider>
      </div>
    )
  }

  const Thumb = ({ item, sliderValue }) => {
    const { activePage, setActivePage, isMobile } = useStateContext();

    const thumbRef = useRef();
    const [loading, setLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const isOnScreen = useOnScreen(thumbRef);
    const [timer, setTimer] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();


    const fetchPage = useCallback(async () => {
      setLoading(true);
      setIsReady(true);
      setLoading(false);
    }, []);

    const handelIncTimer = useCallback(() => { setTimer(prev => prev += 1); }, [timer]);
    const handelResetTimer = useCallback(() => { setTimer(0); }, [timer]);

    useEffect(() => {
      if(!isReady) {
        const counter = setInterval(() => {
          if(isOnScreen) {
            handelIncTimer();
            // setTimer(prev => prev += 1);
          } else {
            handelResetTimer();
            // setTimer(0);
          }
        }, 500);
        return () => clearInterval(counter);
      }
    }, [isOnScreen, isReady]);
    useEffect(() => {
      if(isOnScreen && !isReady && timer > 2) {
        fetchPage();
      }
    }, [isOnScreen, timer]);


    const desktopStylesPage = {
      width: (item.width / 4) * (sliderValue * 0.5), 
      height: (item.height / 4) * (sliderValue * 0.5)
    }
    const mobileStylesPage = {
      width: 80, 
      height: "fit-content",
      minHeight: 80,
    }
    return (
      <a 
        href={`#page_${item.Index}`} 
        onClick={() => {
          setActivePage(item.Index);
          // const element = document.getElementById(`page_${item.Index}`);
          // if (element) element.parentNode.scrollTop = element.offsetTop;
          // if (element) element.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <div 
          key={item.Index} 
          id={`thumb_${item.Index}`} 
          ref={thumbRef}
          className={`thumb-item flex flex-col items-center w-fit h-fit transition-all cursor-pointer bg-neutral-300 dark:bg-neutral-900 dark:bg-opacity-25 bg-opacity-25 dark:hover:bg-opacity-100 hover:bg-opacity-100 ${activePage === item.Index ? "bg-opacity-100 dark:bg-opacity-100" : ""} p-4 pb-1 max-md:p-0 max-md:rounded-sm rounded-lg`}
        >
          <div className="thumb-head"></div>
            <div 
              className={`thumb-body relative overflow-hidden bg-white shadow-xl ${activePage === item.Index && "outline outline-4 outline-slate-400 dark:outline-slate-400"}`} 
              style={isMobile ? mobileStylesPage : desktopStylesPage}
            >
              <Skeleton
                height='100%'
                isLoaded={!loading}
                fadeDuration={2}
                bg='white'
              >
                {!loading && 
                  <div 
                    className="relative"
                  >
                      <img 
                        src={`https://salicapi.com/api/Signature/GetThumbnailPage?Page=${item.Index-1}`} alt=""
                        width="100%" height="100%" 
                        loading="lazy"
                      />
                    <span className="md:hidden absolute bottom-0.5 right-0 text-xs text-neutral-500 px-1">{item.Index}</span>
                    <span className="absolute left-1 top-1">
                      {item.Index === 1 || item.Index === 3 ? <div>
                        <Button size="xs" rounded="full" paddingX={1} className="shadow-md" colorScheme="green" onClick={onOpen}><BiMessageAltDetail size={16} /></Button>
                        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              <span className="flex items-center gap-2">
                                <BiMessageAltDetail size={18} /> Inviter Notes
                              </span>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Text fontWeight='bold' mb='1rem'>
                                Here, You can Read Inviter Notes
                              </Text>
                              <p>
                                Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis.
                              </p>
                              <p>
                                Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                              </p>
                            </ModalBody>

                            <ModalFooter>
                              <Button colorScheme='blue' mr={3} onClick={onClose}>
                                OK
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </div> : null}
                    </span>
                  </div>
                }
              </Skeleton>
            </div>
          <div className={`thumb-footer text-text-color dark:text-white max-md:hidden ${activePage === item.Index ? "text-slate-500 font-semibold" : ""}`}>
            {item.Index}
          </div>
        </div>
      </a>
    )
  }
  const Thumbs = ({ pages }) => {
    const [sliderValue, setSliderValue] = React.useState(3);
    const { activeThumbnailes } = useStateContext();

    return (
      <div style={{ display: activeThumbnailes ? "block" : "none"}} className='w-80 overflow-auto style-scroll bg-neutral-200 drop-shadow-lg border-r-4 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 flex-col resize-x p-4 max-md:fixed max-md:z-50 max-md:left-0 max-md:top-14 max-md:h-full max-md:w-24 max-md:py-2 max-md:px-0.5 max-md:shadow-2xl max-md:pb-16'>
        <div className="max-md:hidden thumbs-header mb-4">
          <SliderThumbs getSliderValue={setSliderValue} />
          {/* <h3 className="font-semibold text-xl text-text-color dark:text-white">Thumbnails</h3> */}
        </div>
        <div className='thumbs-body flex justify-center flex-wrap gap-y-4 max-md:gap-y-2 gap-x-2 max-md:py-1'>
          {
            pages?.map((item, i) => {
              return (
                <Thumb key={i} item={item} sliderValue={sliderValue} />
              )
            })
          }
        </div>
        <div className="thumbs-footer"></div>
      </div>
    )
  }

  const Page = ({item, totalPages}) => {
    const pageRef = useRef();
    const { signatures, setSignatures, scale, rotation, selectedId, pdfQuality, selectShape, onOpen, setNewSignAttrs, handleCloseContextMenu, showContextMenu, contextMenuPosition, setShowContextMenu, handleDeleteSignature, handelAddDate, showDateContextMenu, dateContextMenuPosition, handleDeleteDate } = useStateContext();
    const [isReady, setIsReady] = useState(false);
    const [imgData, setImgData] = useState({});
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const isOnScreen = useOnScreen(pageRef);

    const fetchPage = useCallback(async () => {
      setLoading(true);
      const data = { 
        // src: require(`../assets/images/imagesfile/Logotype ( PDFDrive )_page-${item.Index.toString().padStart(4, '0')}.jpg`),
        src: `https://salicapi.com/api/Signature/GetPage?Page=${item.Index-1}&q=${pdfQuality}`,
        signaturesPlaces: [
          {
            x: 150,
            y: 580,
            width: 120,
            height: 70,
            scaleX: 1,
            scaleY: 1,
          }
        ],
        dates: [
          {
            x: 420,
            y: 720,
          }
        ],
        index: item.Index, 
        size: "1MB", 
        alt: "", 
        width: item.width, 
        height: item.height, 
      };
      setImgData(data);
      setIsReady(true);

      setLoading(false);
    }, []);
    const handelIncTimer = useCallback(() => { setTimer(prev => prev += 1); }, [timer]);
    const handelResetTimer = useCallback(() => { setTimer(0); }, [timer]);
    
    useEffect(() => {
      if(!isReady) {
        const counter = setInterval(() => {
          if(isOnScreen) {
            handelIncTimer();
            // setTimer(prev => prev += 1);
          } else {
            handelResetTimer();
            // setTimer(0);
          }
        }, 500);
        return () => clearInterval(counter);
      }
    }, [isOnScreen, isReady]);
    useEffect(() => {
      if(isOnScreen && !isReady && timer >= 3) {
        fetchPage();
      }
      // if(isOnScreen && timer >= 1) {
      //   setActivePage(item.Index);
      // }
    }, [isOnScreen, timer]);
    // to refetch images after user change pdf quality
    useEffect(() => {
      setIsReady(false);
    }, [pdfQuality]);

    const checkDeselect = (e) => {
      // deselect when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        selectShape(null);
        setShowContextMenu(false);
      }
    };

    const Drawing = () => (
      <Stage
        width={item.width * scale}
        height={item.height * scale}
        scale={{x: scale, y: scale}}
        rotation={rotation}
        style={{position: "absolute", top: 0, left: 0}}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {/* {imgData?.signaturesPlaces?.map((sign, i) => (
            <Group>
              <URLImage
                key={i}
                src={signPlaceholder}
                shapeProps={{
                  ...sign,
                  draggable: false,
                  shadowBlur: 5,
                  shadowOpacity: 0.15,
                  shadowOffsetY: 3,
                }}
              />
              <Rect 
                {...sign}
                fill="#8ea4ff33"
                onClick={(e) => {
                  setNewSignAttrs({...sign, page: item.Index});
                  onOpen();
                  selectShape(null);
                }}
                onTap={(e) => {
                  setNewSignAttrs({...sign, page: item.Index});
                  onOpen();
                  selectShape(null);
                }}
              />
            </Group>
          ))} */}
          {imgData?.dates?.map((date, i) => (
            <Rect
              key={i}
              x={date.x}
              y={date.y}
              width={70}
              height={15}
              fill="#fff"
              shadowColor="black"
              shadowOffsetY={2}
              shadowBlur={5}
              shadowOpacity={0.15}
              onClick={(e) => {
                const newItem = {...date, _id: i+1, page: item.Index, dateText: new Date().toLocaleDateString(), width: 70, height: 15, scaleX: 1, scaleY: 1};
                handelAddDate(newItem);
              }}
              onTap={(e) => {
                const newItem = {...date, _id: i+1, page: item.Index, dateText: new Date().toLocaleDateString(), width: 70, height: 15, scaleX: 1, scaleY: 1};
                handelAddDate(newItem);
              }}
            />
          ))}
        </Layer>
        <Layer clearBeforeDraw={true}>
          <DrawSignatures pageNumber={item.Index} />
          <DrawDates pageNumber={item.Index} />
        </Layer>
      </Stage>
    );
    


    useEffect(() => {
      if(isLoaded) {
        const pageSignatures = imgData.signaturesPlaces.map(sign => ({
          _id:  `${item.Index}__${signatures.length}`,
          page: item.Index,
          imageData: signPlaceholder,
          originalImage: null,
          ...sign
        }));
        setSignatures(prev => [...prev, ...pageSignatures]);
      }
    }, [isLoaded]);


    return (
      <div key={item.Index} ref={pageRef} id={`page_${item.Index}`} className={`page-item mb-6 transition-all ${isReady ? "opacity-100" : "opacity-25"}`}>
        <div 
          className="text-9xl bg-white rounded-sm overflow-hidden text-text-color" 
          style={{width: item.width * scale, height: item.height * scale, transform: `rotate(${rotation}deg)`}}
        >
          {
            !loading
            ? (
              <>
                {isLoaded && <Drawing />}
                <img 
                  src={imgData.src} alt=""
                  width={imgData.width * scale} height={imgData.height * scale} 
                  onLoad={() => setIsLoaded(true)}
                />
              </>
            ) : (
              <div className="flex justify-center mt-14"><Spinner size='md' /></div>
            )
          }
          {showContextMenu && selectedId !== null && (
            <ContextMenu x={contextMenuPosition.x} y={contextMenuPosition.y} onClose={handleCloseContextMenu}>
              <ul className="bg-neutral-100 w-32">
                <li
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transition-all"
                  onClick={onOpen}
                >
                  <CgArrowsExchange size={18} /> Change
                </li>
                <li
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white cursor-pointer transition-all"
                  onClick={handleDeleteSignature}
                >
                  <HiOutlineTrash size={18} /> Delete
                </li>
              </ul>
            </ContextMenu>
          )}
          {showDateContextMenu && (
            <ContextMenu x={dateContextMenuPosition.x} y={dateContextMenuPosition.y} onClose={handleCloseContextMenu}>
              <ul className="bg-neutral-100 w-32">
                <li
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white cursor-pointer transition-all"
                  onClick={() => handleDeleteDate(dateContextMenuPosition._id)}
                >
                  <HiOutlineTrash size={18} /> Delete
                </li>
              </ul>
            </ContextMenu>
          )}
        </div>
        <div className='mt-2 h-4'>
          <p className="text-sm float-left max-md:hidden">78d11272-86b3-49fe-a3d5-284ecf48ec01</p>
          <p className="text-sm md:float-right text-center">{item.Index} / {totalPages}</p>
        </div>
      </div>
    )
  }
  const Document = ({ pages }) => {
    const pagesParentRef = useRef(null);
    const { scale } = useStateContext();

    return (
      <div className="flex-[7] flex flex-col bg-neutral-300 px-0 md:px-6 dark:bg-neutral-700 overflow-auto">
        <div className="pages-header"></div>
        <div className='pages-body h-full'>
          <div ref={pagesParentRef} id="pagesParentRef" className='pages block h-full pt-5 pb-10'>
            {
              pages?.map((item) => (
                <div key={item.Index} className="mx-auto last:pb-8" style={{ width: item.width * scale }}>
                  <Page
                    item={item} 
                    totalPages={pages.length} 
                    // setDocumentSchema={setDocumentSchema}
                  />
                </div>
              ))
            }
          </div>
        </div>
        <div className="pages-footer"></div>
      </div>
    )
  }





const ESignDocument = () => {
  const { activeThumbnailes, documentSchema, setZoom, setScaleByParentWidth, isMobile, isOpen, onOpen, onClose } = useStateContext();

  useEffect(() => {
    document.title = `SALIC eSign - [${documentSchema.title}]`
  }, [documentSchema]);

  useEffect(() => {
    setZoom(setScaleByParentWidth());
  }, [activeThumbnailes]);


  return (
    <div className="w-screen h-screen overflow-auto bg-white">
      <Header docSchema={documentSchema} />
      <ToolsHeader actions={documentSchema.actions} />

      <main className="flex flex-1 h-full max-md:h-[86vh] md:pt-[90px]">
        <SignaturePad isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        {/* {activeThumbnailes && <Thumbs pages={documentSchema.pages} actions={documentSchema.actions} />} */}
        <Thumbs pages={documentSchema.pages} actions={documentSchema.actions} />
        <Document pages={documentSchema.pages} />
      </main>
    </div>
  )
}

export default ESignDocument
