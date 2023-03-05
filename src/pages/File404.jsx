import React from "react";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";

const File404 = () => {
  return (
    <div>
      <Alert
        status='warning'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='100vh'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={8} mb={4} fontSize='4xl'>
          404 FILE!
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          It seems that there is something wrong with the link, or the file does not exist, or check your Internet connection.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default File404