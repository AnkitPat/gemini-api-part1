import '../../App.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Backdrop, CircularProgress, IconButton } from '@mui/material'
import { Attachment } from '@material-ui/icons'

function SimpleResponseWithImage () {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({})
  const [enteredText, setEnteredText] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [iamgeUploading, setImageUploading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const inputFile = useRef(null)

  useEffect(() => {
    if (!selectedImage) return
    setSelectedImageUrl('')
    const formdata = new FormData()
    formdata.append('fileName', selectedImage?.files[0]?.name)
    formdata.append(
      'image',
      selectedImage?.files[0],
      selectedImage?.files[0]?.name
    )

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    }
    setImageUploading(true);
    fetch('http://localhost:3001/uploadfile', requestOptions)
      .then(response => response.json())
      .then(result => {
        setSelectedImageUrl(result.path)
      })
      .catch(error => console.error(error))
      .finally(_ => {
        setImageUploading(false);
      })
  }, [selectedImage])

  const callGemini = useCallback(() => {
    setLoading(true)
    fetch(
      `http://localhost:3001/generatecontentwithimage?text=${enteredText}&imagePath=${selectedImageUrl}&imageType=${selectedImage?.files[0]?.type}`
    )
      .then(response => response.json())
      .then(finalResponse => {
        console.log(finalResponse)
        setResponse(finalResponse)
        setLoading(false)
        setEnteredText('')
        setSelectedImageUrl('')
        setSelectedImage('');
        inputFile.current.value = '';
      })
      .catch(_ => {
        setLoading(false)
        setResponse('')
        setEnteredText('')
        setSelectedImageUrl('')
        setSelectedImage('');
        inputFile.current.value = '';
      })
  }, [enteredText, selectedImageUrl, selectedImage])

  const changeEventCallback = useCallback(event => {
    setEnteredText(event.target?.value ?? '')
  }, [])

  const buttonText = useMemo(() => {
    return loading ? <CircularProgress size={10} /> : 'Hit!!'
  }, [loading])

  const handleFileInputChange = useCallback(event => {
    setSelectedImage(event.target)
  }, [])

  const renderAttachment = useMemo(() => {
    return <img style={{width: '100px'}} src={selectedImageUrl}/>
  }, [selectedImageUrl])

  const loader = useMemo(() => {
    return iamgeUploading && <Backdrop open><CircularProgress/></Backdrop>
  }, [iamgeUploading]);

  return (
    <div className='App'>
      <div className='container'>
        {loader}
        <span>Please enter any text. When done click on Hit</span>
        <div>
          <input
            value={enteredText}
            type='text'
            className='single-with-image-input'
            placeholder='Enter any question you like to ask?'
            onChange={changeEventCallback}
          />
          <IconButton onClick={() => inputFile?.current?.click()}>
            <Attachment />
          </IconButton>
        </div>
        {renderAttachment}
        <button onClick={callGemini}>{buttonText}</button>

        <p>{response?.message}</p>
        <input
          style={{ display: 'none' }}
          accept='image/jpeg, image/png'
          ref={inputFile}
          id="file"
          onChange={handleFileInputChange}
          type='file'
        />
      </div>
    </div>
  )
}

export default SimpleResponseWithImage
