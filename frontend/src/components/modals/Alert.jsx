import { IoMdWarning, IoMdCheckmarkCircle } from "react-icons/io";

export default function Alert({ success, message }) {

    return (
        <div className={`alert-modal ${success ? `alert-success` : `alert-failure`}`}>
            <div className='alert-heading'>
                {!success && (
                    <>
                        <IoMdWarning className='alert-icon'/>
                        <p>Action Required!</p>
                    </>
                )}
                {success && (
                    <>
                        <IoMdCheckmarkCircle className='alert-icon'/>
                        <p>Success!</p>
                    </>
                )}
            </div>
            <div className='alert-body'>
                <p>{message}</p>
            </div>
        </div>
    )
}