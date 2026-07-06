
import { useState } from 'react';
import '../styles/CandidateEvaluation.css';
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


type Props = {
    evaluate: EvaluationResult[];
};
export default function CandidateEvaluation({ evaluate }: Props) {
  console.log(evaluate);
  if (!evaluate) return null;
  const [showMore, setShowMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { matched_skills: 'skills', label: 'Matched Skills', content: evaluate.matched_skills },
    { key: 'missing_skills', label: 'Missing Skills', content: evaluate.missing_skills },
    { red_flags: 'education', label: 'Red Flags', content: evaluate.red_flags },
  ];
  const sortedCandidates = [...evaluate].sort((a, b) => b.overall_score - a.overall_score);
  return (
    <div className="evaluation-results">
      
      {sortedCandidates.map((candidate, index) => (
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginTop: 16, justifyContent: 'center', alignContent: 'center'}}>
        <div className='info' key={index} >
          <div className='lest-side'>
          <p><strong>Name:</strong> {candidate.name}</p>
          <p><strong>Email:</strong> {candidate.email}</p>
          </div>
          <div className="right-side">
            <p {...(candidate.recommendation === 'strong_fit' ? { style: { color: "green" } } : candidate.recommendation === 'moderate_fit' ? { style: { color: "orange" } } : { style: { color: "red" } })}>
              {candidate.overall_score}/100
            </p>
            <p><strong>Phone:</strong> {candidate.phone}</p>
          </div>
          
        </div>
        <button onClick={() => {setClicked(!isClicked)}}>Show more \/</button>
          <div {...(isClicked ? {style: {display: 'flex'}} : {style: {display:'none'}})}>
            <p><strong>Experience Summary: </strong>{candidate.experience_summary}</p>
          </div>
        </div>
      ))}
      

      </div>
  );
}