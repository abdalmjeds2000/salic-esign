import React, { memo, useEffect, useReducer, useRef, useState } from 'react';
import { Button, Divider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip, useToast } from '@chakra-ui/react';
import { FaEraser, FaRedo, FaUndo } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useStateContext } from '../../context/ContextProvider';
import { ReactSketchCanvas } from "react-sketch-canvas";
import { ImPencil2 } from 'react-icons/im';
import { HiOutlineTrash } from 'react-icons/hi';
import { MdOutlineFileUpload } from 'react-icons/md';


const reducerPenWidth = (state, action) => {
  switch (action.type) {
    case "INCREASE":
      return state < 20 ? state + 1 : state;
    case "DECREASE":
      return state > 1 ? state - 1 : state;
    default:
      return 10;
  }
};
const penColorsList = [
  { key: 1, name: "blackAlpha", hex: "#000000" },
  { key: 2, name: "blue", hex: "#4239ff" },
  { key: 3, name: "red", hex: "#ff4239" },
  { key: 4, name: "green", hex: "#24cd75" },
];



const activeTabStyles = { bg: "gray.100", color: "#333", fontWeight: 500, borderBottom: "5px solid var(--chakra-colors-blue-600)" };




const SignaturePad = () => {
  const { signatures, setSignatures, selectShape, isOpen, onClose, newSignAttrs, selectedId, setShowContextMenu } = useStateContext();
  const signatureCanvasRef = useRef();
  const [imageBase64, setImageBase64] = useState('');
  const [penWidth, dispatchPW] = useReducer(reducerPenWidth, 5);
  const [penColor, setPenColor] = useState("#000000");
  const toast = useToast();

  const onModalClose = () => {
    onClose();
  }

  const isUpdateMode = selectedId !== null;
  let selectedItem;
  let itemType;
  if(isUpdateMode) {
    selectedItem = signatures.filter(s => s._id === selectedId)[0];
    itemType = selectedItem.type;
  }
  useEffect(() => {
    if(isOpen && isUpdateMode) {
      if(itemType === "upload") {
        setImageBase64(selectedItem.originalImage);
      }
    } else {
      setImageBase64("");
    }
  }, [isUpdateMode, isOpen])

  const handleCreateDrawSignature = async () => {
    const paths = await signatureCanvasRef.current.exportPaths();
    const imgData = await signatureCanvasRef.current.exportImage("png");

    if(paths?.length) {
      if(isUpdateMode) {
        const upatedItem = {
          ...selectedItem,
          originalImage: imgData, /* signPaths: paths, */
        };
        const updatedSignatures = signatures.map(sign => {
          if(sign._id === upatedItem._id) {
            sign = upatedItem;
          }
          return sign
        });
        setSignatures(updatedSignatures);
        onModalClose();
      } else {
        const item = {
          ...newSignAttrs,
          originalImage: imgData, /* signPaths: paths, */
          type: "draw",
        };
        const updatedSignatures = signatures.map(sign => {
          if(sign._id === newSignAttrs._id) {
            sign = item;
          }
          return sign
        });
        setSignatures(updatedSignatures);
        selectShape(item._id);
        onModalClose();
      }
    } else {
      toast({
        title: "Draw First",
        status: "error",
        isClosable: true,
      });
    }
    setShowContextMenu(false);
  }

  const handleCreateUploadSignature = async () => {
    if(imageBase64 && imageBase64.length) {
      const imgData = imageBase64;
      if(isUpdateMode) {
        const upatedItem = {
          ...selectedItem,
          originalImage: imgData,
        };
        const updatedSignatures = signatures.map(sign => {
          if(sign._id === upatedItem._id) {
            sign = upatedItem;
          }
          return sign
        })
        setSignatures(updatedSignatures);
      } else {
        const item = {
          ...newSignAttrs,
          originalImage: imgData,
          type: "upload",
        };
        const updatedSignatures = signatures.map(sign => {
          if(sign._id === newSignAttrs._id) {
            sign = item;
          }
          return sign
        });
        setSignatures(updatedSignatures);
        selectShape(item._id);
      }
      setImageBase64("");
      onModalClose();
      setShowContextMenu(false);
    } else {
      toast({
        title: "Upload Image First",
        status: "error",
        isClosable: true,
      });
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    try {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
    } catch (err) {
      console.log("cancel select file");
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} size="3xl" onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Draw Your Signature</ModalHeader>
          <ModalCloseButton />
          <ModalBody className='p-0' padding={5}>
            <Tabs isFitted paddingBottom={5} defaultIndex={!isUpdateMode || itemType === "draw"? 0 : 1} variant="enclosed">
              <TabList>
                <Tab borderBottom="5px solid #eee" isDisabled={!isUpdateMode ? false : (itemType === "draw" ? false : true)} _selected={activeTabStyles}>Draw</Tab>
                <Tab borderBottom="5px solid #eee" isDisabled={!isUpdateMode ? false : (itemType === "draw" ? true : false)} _selected={activeTabStyles}>Upload</Tab>
              </TabList>
              <TabPanels className="dark:border-neutral-700">
                <TabPanel padding={0}>
                  <div className='flex flex-col gap-2'>
                    <div className='relative'>
                      <ReactSketchCanvas
                        className='relative mb-3 signatures-drawer-canvas bg-neutral-50'
                        height={280}
                        ref={signatureCanvasRef}
                        strokeWidth={penWidth}
                        strokeColor={penColor}
                        // backgroundImage={"https://www.pngmart.com/files/3/Horizontal-Line-Transparent-Background.png"}
                        exportWithBackgroundImage={false}
                        canvasColor="#ffffff00"
                      />
                      <span className='absolute h-0.5 w-3/4 left-[12.5%] top-2/3 bg-[#00000010]'></span>
                    </div>
                    <div className='flex flex-wrap gap-3 justify-between w-full mx-3'>
                      <div className="flex flex-wrap gap-5">
                        <Tooltip label="Pen Width">
                          <div>
                            <Button colorScheme='blue' size="sm" roundedLeft="lg" padding={1} roundedRight="none" onClick={() => dispatchPW({ type: "INCREASE" })}>
                              <AiOutlinePlus />
                            </Button>
                            <Button colorScheme='gray' size="sm" rounded="none">
                              {penWidth}
                            </Button>
                            <Button colorScheme='gray' size="sm" variant="outline" roundedRight="lg" padding={1} roundedLeft="none" onClick={() => dispatchPW({ type: "DECREASE" })}>
                              <AiOutlineMinus />
                            </Button>
                          </div>
                        </Tooltip>
                        <Divider orientation='vertical' className='max-md:hidden' />
                        <Tooltip label="Pen Color">
                          <div className='flex gap-1'>
                            {penColorsList.map((item, i) => (
                              <Button
                                key={i}
                                size="sm"
                                className={`p-1 rounded-full w-8 h-8 flex align-middle justify-center`}
                                style={{ backgroundColor: penColor !== item.hex ? item.hex+30 : item.hex, border: `3px solid ${item.hex}` }}
                                onClick={() => {
                                  setPenColor(item.hex);
                                  signatureCanvasRef.current.eraseMode(false);
                                }}
                                rounded="full"
                              >
                                {/* <Radio 
                                  key={item.key} size='lg' colorScheme={item.name} 
                                  onClick={() => setPenColor(item.hex)} 
                                  style={{ border: `3px solid ${item.hex}` }} 
                                  _Checked={{ background: item.hex }}
                                  isChecked={penColor === item.hex} /> */}
                              </Button>
                            ))}
                          </div>
                        </Tooltip>
                        <Divider orientation='vertical' className='max-md:hidden' />
                        <div className='flex gap-1'>
                          <Tooltip label="Click to Draw">
                            <Button size="sm" onClick={() => signatureCanvasRef.current.eraseMode(false)}><ImPencil2 /></Button>
                          </Tooltip>
                          <Tooltip label="Eraser">
                            <Button size="sm" onClick={() => signatureCanvasRef.current.eraseMode(true)}><FaEraser /></Button>
                          </Tooltip>
                          <Tooltip label="Undo">
                            <Button size="sm" onClick={() => signatureCanvasRef.current.undo()}><FaUndo /></Button>
                          </Tooltip>
                          <Tooltip label="Redo">
                            <Button size="sm" onClick={() => signatureCanvasRef.current.redo()}><FaRedo /></Button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end m-3 mt-6'>
                    <Tooltip label="Reset Canvas">
                      <Button size="md" variant="outline" colorScheme="red" mr="2" onClick={() => signatureCanvasRef.current.resetCanvas()}>Clear</Button>
                    </Tooltip>
                    <Button colorScheme='green' size="md" onClick={handleCreateDrawSignature}>
                      {isUpdateMode ? "Update" : "Create"}
                    </Button>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div>
                    <div>
                      <div className='flex flex-wrap items-end gap-2 mb-6'>
                        <Button colorScheme="blue" padding={0}> 
                          <label htmlFor="file-upload" className="flex items-center gap-2 px-4 cursor-pointer">
                            <MdOutlineFileUpload size={24} />
                            <span>Upload Signature</span>
                          </label>
                        </Button>
                        <span className='text-base text-neutral-300'>accept (.png, .jpg and .jpeg)</span>
                        <input id="file-upload" className='block' type="file" accept='image/png, image/jpg, image/jpeg' onChange={handleImageChange} />
                      </div>
                      <div className='p-4 border-2 border-dashed rounded-lg'>
                        {
                          imageBase64 && imageBase64?.length
                          ? <img src={imageBase64} alt="signature" className='bg-white' />
                          : <span className='block text-center text-neutral-300'>PREVIEW PLACE</span>
                        }
                      </div>
                    </div>
                    <div className='mt-6 flex justify-end'>
                      {(imageBase64 || imageBase64?.length > 0) && <Button 
                        colorScheme="red" 
                        variant="solid"
                        mr={2}
                        onClick={() => setImageBase64("")}>
                        <HiOutlineTrash />
                      </Button>}
                      <Button colorScheme='green' onClick={handleCreateUploadSignature}>
                        {isUpdateMode ? "Update" : "Create"}
                      </Button>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          {/* <ModalFooter>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  )
}


export default memo(SignaturePad)







