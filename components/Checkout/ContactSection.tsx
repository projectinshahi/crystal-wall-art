import { Typography } from '../ui/Typography'
import FormInput from '../inputs/FormInput'

const ContactSection = ({
    email,
    setEmail,
    error
}: {
    email: string;
    setEmail: (value: string) => void;
    error?: string;
}) => {

    return (
        <div className="bg-lightGray border border-grayBorder rounded-xl p-4 space-y-3">
            <div>
                <Typography className='font-semibold' variant='label'>Contact Information</Typography>
                <Typography className='' variant='caption'>We'll use this for order updates</Typography>
            </div>
            <FormInput
                label="Email"
                value={email}
                onChange={setEmail}
                required
                error={error}
            />
        </div>
    )
}

export default ContactSection