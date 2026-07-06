import DragAndDrop from './components/dragAndDrop'
import HeroPage from './components/HeroPage'
import JobDescriptionInput from './components/jobDescriptionInput'
import Button from './components/Button'
import './App.css'
import { useState } from 'react'
import pdfToText from 'react-pdftotext';
import mammoth from 'mammoth';

import CandidateEvaluation from './components/CandidateEvaluation';

type EvaluationResult = {
    name: string;
    email: string;
    phone: string;
    overall_score: number;
    matched_skills: string[];
    missing_skills: string[];
    experience_summary: string;
    red_flags: string[];
    recommendation: string;
  
};



function App() {
  const [result, setResult] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobDescriptionText, setText] = useState <string>("");
  const [CVfile, setFile] = useState<File[]>([]);
  const isValid = jobDescriptionText.trim() !== "" && CVfile.length > 0;


  async function convertFileToText(file: File | null) {
    if (file) {
      if (file.type === 'application/pdf') {
        const text = await pdfToText(file);
        return text;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        return value;
      }
    }
  }

  async function handleEvaluate() {
    for (const file of CVfile) {
      const cvText = await convertFileToText(file);
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cvText: cvText,
            jobDescriptionText: jobDescriptionText,
          }),
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
        setResult(prev => [...(prev || []), data.evaluation]);
        console.log('Got evaluation:', data);
        } catch (err) {
        console.error(err);
      }
  
    }
    
    
      setLoading(false);
    
  };
  //console.log('result:', result, 'error:', error, 'loading:', loading);
  return (
    <section>
      <HeroPage />
      <div id="inputs">
        <DragAndDrop onFileSelect={setFile}/>
        <JobDescriptionInput value={jobDescriptionText} onChange={setText}/>
        
      </div>
      
      
      <Button className='Buttoms_submit_Clear' disabled={!isValid} text="Submit" onClick={handleEvaluate} />
        {loading ? 'Evaluating...' : 'Evaluate CV'}
        {result ? <p></p> : <h2 style={{marginTop: '20px'}}>Evaluation Result</h2>}
      <CandidateEvaluation evaluate={result} />
    </section>
  )
  
}

export default App
