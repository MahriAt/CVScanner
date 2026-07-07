import {useRef, useState} from "react"
import '../styles/dragAndDrop.css'

interface DragAndDropProps {
  onFileSelect: (files: File[]) => void;
}

export default function DragAndDrop({ onFileSelect }: DragAndDropProps) {

    const uploadRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File[] | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState(false)
    
    

    const handleChange = ()=> {
        const file = uploadRef.current?.files?.[0];
        if (!file || (file.type !== 'application/pdf' && 
            file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
             file.size > (1 * 1024 * 1024 )){
            
            return setError(true)}
        console.log(file)
        const fileArray = Array.from(uploadRef.current?.files || []);
        setFile(fileArray)
        onFileSelect(fileArray);
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>)=> {
        e.preventDefault()
        console.log("Dragged over")
        setIsDragOver(true)
    }
    const handleDrop = (e: React.DragEvent<HTMLDivElement>)=> {
        const dragFile = e.dataTransfer.files.item(0);
        if (!dragFile ||
            (dragFile.type !== 'application/pdf' &&
             dragFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
            dragFile.size > (1 * 1024 * 1024)) {
            e.preventDefault()
            return setError(true)
        }
        e.preventDefault()
        console.log("File dropped")
        console.log(e.dataTransfer.files[0])
        const fileArray = Array.from(e.dataTransfer.files);
        setFile(fileArray)
        setIsDragOver(false)
        onFileSelect(fileArray);
    }
    

    return(<div>
    <div style={{backgroundColor: isDragOver ? '#555' : 'none'}}
    id="upload" 
    onClick={() => uploadRef.current?.click()}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
    onDragLeave={() => setIsDragOver(false)}
    >
        <input type="file" ref={uploadRef} multiple style= {{display: 'none'}} onChange={handleChange} />
        <h2>Upload</h2>
        { file && file.map((f, i) => <p key={i}>{f.name}</p>)}
    </div>
    {error? <p style={{color: 'red'}}>Please upload PDF or DOCX file not bigger 1MB</p> : <p></p>}
    <button 
    className="Buttoms_submit_Clear" 
    onClick={()=>{setFile(null); 
    if(uploadRef.current) 
        uploadRef.current.value = ''; 
    setError(false)}}>
        Clear
    </button>
    </div>);
}