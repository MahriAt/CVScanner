import {useRef, useState} from "react"
import '../styles/dragAndDrop.css'

export default function DragAndDrop(){

    const uploadRef = useRef(null);
    const [file, setFile] = useState(null)
    const [url, setUrl] = useState(null)
    const [isDragOver, setIsDragOver] = useState(false)

    const handleChange = (e)=> {
        console.log(uploadRef.current.files[0])
        setFile(uploadRef.current.files[0])
    }

    const handleDragOver = (e)=>{
        e.preventDefault()
        console.log("Dragged over")
        setIsDragOver(true)
    }
    const handleDrop = (e)=>{
        e.preventDefault()
        console.log("File dropped")
        console.log(e.dataTransfer.files[0])
        setFile(e.dataTransfer.files[0])
        setUrl(URL.createObjectURL(e.dataTransfer.files[0]))
    }
    return(
    <div style={{backgroundColor: isDragOver ? '#555' : 'none'}}
    id="upload" 
    onClick={() => uploadRef.current.click()}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
    onDragEnd={()=>setIsDragOver(false)}
    >
        <input ref={uploadRef} type="file" style= {{display: 'none'}} onChange={handleChange}/>
        <h2>Upload</h2>
        <p>{file&&file.name}</p>
        
    </div>)
}