export default function NameValueView({name, value}: { name: string, value: any }) {
    return (
        <li className="py-1">
            <span className="font-semibold mx-0.5">{name}</span>
            {value}
        </li>
    )
}