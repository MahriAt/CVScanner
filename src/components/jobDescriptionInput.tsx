import '../styles/jobDescriptionInput.css'

export default function jobDescriptionInput() {
    return (
        <div className="job-description-input">
            <h1>Job Description</h1>
            <p>Enter the job description below:</p>
            <textarea rows={10} cols={100}></textarea>
        </div>
    )
}