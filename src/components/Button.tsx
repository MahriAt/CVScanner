import '../styles/Button.css'

export default function Button({className, text, onClick, disabled}: {className: string, text: string, onClick: () => void, disabled: boolean}) {
    return (
        <button className={className} type="button" disabled={disabled} onClick={onClick}>{text}</button>
    )
}