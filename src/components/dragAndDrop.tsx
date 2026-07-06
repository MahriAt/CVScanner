import {useRef, useState} from "react"
import '../styles/dragAndDrop.css'

interface DragAndDropProps {
  onFileSelect: (files: File[]) => void;
}

export default function DragAndDrop({ onFileSelect }: DragAndDropProps) {

    const uploadRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File[] | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    
    

    const handleChange = ()=> {
        if (uploadRef.current?.files?.[0].type !== 'application/pdf' && uploadRef.current?.files?.[0].type !=='application/vnd.openxmlformats-officedocument.wordprocessingml.document')    
            return alert("Please upload a PDF or DOCX file")
        console.log(uploadRef.current?.files[0])
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
        if(e.dataTransfer.files.item(0)?.type !== 'application/pdf' && e.dataTransfer.files.item(0)?.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            e.preventDefault()
            return alert("Please upload a PDF or DOCX file")
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
    <button className="Buttoms_submit_Clear" onClick={()=>{setFile(null); if(uploadRef.current) uploadRef.current.value = '';}}>Clear</button>
    </div>);
}