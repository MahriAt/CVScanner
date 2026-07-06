export default function Button({text, onClick, disabled}: {text: string, onClick: () => void, disabled: boolean}) {
    return (
        <button type="button" disabled={disabled} onClick={onClick}>{text}</button>
    )
}