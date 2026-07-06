
import '../styles/jobDescriptionInput.css'

export default function jobDescriptionInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="job-description-input">
            <h1>Job Description</h1>
            <p>Enter the job description below:</p>
            <textarea 
                rows={10} 
                cols={100} 
                value={value}
                onChange={(e) => onChange(e.target.value)}
            ></textarea>
        </div>
    )
}