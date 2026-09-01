import { IoMdWarning } from "react-icons/io"

export default function Alert({ message }) {

    return (
        <div className='alert-modal'>
            <div className='alert-heading'>
                <IoMdWarning className='alert-icon'/>
                <p>Action Required!</p>
            </div>
            <div className='alert-body'>
                <p>{message}</p>
            </div>
        </div>
    )
}