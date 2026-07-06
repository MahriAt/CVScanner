import { useState } from 'react';
import '../styles/CandidateEvaluation.css';
import arrow_down from '../assets/arrow_down.png';
import arrow_up from '../assets/arrow_up.png';

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

const scoreColor = (recommendation: string) => {
  if (recommendation === 'strong_fit') return 'green';
  if (recommendation === 'moderate_fit') return 'orange';
  return 'red';
};

function CandidateCard({ candidate }: { candidate: EvaluationResult }) {
  const [showMore, setShowMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { key: 'matched_skills', label: 'Matched Skills', content: candidate.matched_skills },
    { key: 'missing_skills', label: 'Missing Skills', content: candidate.missing_skills },
    { key: 'red_flags', label: 'Red Flags', content: candidate.red_flags },
  ];

  const active = categories.find((c) => c.key === activeCategory);
  const Email = "mailto:"+candidate.email.toString();

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="info">
        <div className="left-side">
          <p><strong>Name:</strong></p>
          <p><strong>Email:</strong> <a href={`mailto:${candidate.email}`}>{candidate.email}</a> </p>
        </div>
        <div className="right-side">
          <p style={{ color: scoreColor(candidate.recommendation) }}>
            {candidate.overall_score}/100
          </p>
          <p><strong>Phone:</strong><a href={`tel:${candidate.phone}`}> {candidate.phone}</a></p>
        </div>
      </div>

      <button onClick={() => setShowMore(!showMore)} className='showMore'>
        {showMore ? <img src= {arrow_up} /> : <img src= {arrow_down}/>}
      </button>

      {showMore && (
        <div style={{ marginTop: 12 }}>
          <p><strong>Experience Summary:</strong> {candidate.experience_summary}</p>

          <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  width: '100%',
                  padding: '4px 12px',
                  borderRadius: 16,
                  border: '1px solid #ccc',
                  background: activeCategory === cat.key ?  '#f5f5f5' : 'none' ,
                  color: activeCategory === cat.key ?  '#000' : '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {active && (
            <div style={{ padding: 12, background: '#140c19', borderRadius: 6 }}>
              {active.content.length > 0 ? (
                <ul>
                  {active.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>None</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CandidateEvaluation({ evaluate }: Props) {
  if (!evaluate) return null;

  const sortedCandidates = [...evaluate].sort((a, b) => b.overall_score - a.overall_score);

  return (
    <div className="evaluation-results">
      {sortedCandidates.map((candidate, index) => (
        <CandidateCard key={index} candidate={candidate} />
      ))}
    </div>
  );
}