export default function PageTitle({ title }) {
    return <title>{title ? `${title} | Pantry` : `Pantry`}</title>
}