import { LinearProgress, Modal, Paper, Stack, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { FC, useState } from "react"
import { Controller } from "react-hook-form"
import {useDropzone} from 'react-dropzone';
import { compressAndCropImageFile } from "@src/utils/images";
import theme from "@src/theme";
import { JSX } from "@emotion/react/jsx-runtime";

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const uploadBoxStyle = {
  width: 325,
  height: 100,
  padding: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  fontWeight: 500,
  fontSize: 20,
  cursor: "pointer",
  color: "#cccccc",
}

const InputFormPicture: FC<any> = ({name, control, children}) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return(
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: {onChange} }) => (
          <Modal
          keepMounted
          open={openModal}
          onClose={handleClose}
          aria-labelledby="Editar foto de perfil"
          aria-describedby="modal-modal-description"
          >
            <Paper sx={modalStyle}>
              <Dropzone
                onUpload={(fileUrl: string) => {
                  handleClose()
                  onChange(fileUrl)
                }}
              />
            </Paper>
          </Modal>
        )}
      />
      {/* Display */}
      <Box onClick={handleOpen}>
        {children}
      </Box>
    </>
  )

}

const Dropzone: FC<any> = ({ onUpload }) => {
  const [disabledDropzone, setDisabledDropzone] = useState(false)
  const [ uploadState, setUploadState ] = useState("no-image")
  
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"]
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    async onDropAccepted(acceptedFiles) {
      setUploadState("processing")
      setDisabledDropzone(true)
      const fd = new FormData();

      let img: File = acceptedFiles[0]

      try {
        const compressedImg: any = await compressAndCropImageFile(img, 512, 80)
        fd.append("pictureFile", compressedImg)
      }
      catch {
        setUploadState("failure")
      }

      setUploadState("uploading")
      const res = await fetch("/api/uploadPicture", {
        method: "POST",
        body: fd
      })
      
      if (res.status === 200) {
        const res_data = await res.json()
        console.log(res_data)
        onUpload(res_data.fileUrl)
        setUploadState("uploaded")
        console.log("File uploaded")
      }
      else {
        setUploadState("failure")
        console.log(res)
      }
      setDisabledDropzone(false)
    }
  });
  // console.log(acceptedFiles)
  
  let stateDialog: JSX.Element
  switch (uploadState) {
    case "processing":
      stateDialog = (<Typography>Procesando Imagen</Typography>)
      break
    case "uploading":
      stateDialog = (<Typography>Subiendo Imagen</Typography>)
      break
    case "uploaded":
      stateDialog = (<Typography>Archivo subido exitosamente</Typography>)
      break
    case "failure":
      stateDialog = (<Typography color={theme.palette.error.main}>Error al subir imagen</Typography>)
      break
    default:
      stateDialog = (<></>)
  }

  return (
    <Stack sx={{textAlign: "center", alignItems: "center"}}>
      <Box sx={uploadBoxStyle} {...getRootProps({className: 'dropzone'})}>
        <span className="drop-zone__prompt">
          Suelte el archivo aquí o haga clic para cargar
        </span>
        <input {...getInputProps()} disabled={disabledDropzone}/>
      </Box>
      {["processing", "uploading"].includes(uploadState)? <Box sx={{width:300}}><LinearProgress/></Box>: ""}
      {stateDialog}
    </Stack>
  )

}

export default InputFormPicture