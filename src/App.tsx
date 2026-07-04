import DragAndDrop from './components/dragAndDrop'
import HeroPage from './components/HeroPage'
import JobDescriptionInput from './components/jobDescriptionInput'
import Button from './components/Button'
import './App.css'
import { useState } from 'react'
import cvSampleText from "./cvSampleText.txt?raw";
import jobDescriptionText from "./jobDescription.txt?raw";



function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleEvaluate() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: cvSampleText,
          jobDescriptionText: jobDescriptionText,
        }),
      });
      const data = await res.json();
      setResult(data.evaluation);
      console.log('Got evaluation:', data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  //console.log('result:', result, 'error:', error, 'loading:', loading);
  return (
    <section>
      <HeroPage />
      <div id="inputs">
        <DragAndDrop />
        <JobDescriptionInput />
        
      </div>
      <Button text="Submit" onClick={handleEvaluate} />
         {loading ? 'Evaluating...' : 'Evaluate CV'}
         {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </section>
  )
  
}

export default App
