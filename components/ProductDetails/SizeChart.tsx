import { Typography } from "../ui/Typography";

type Props = {
    size?: string;
    thickness?: string;
    mounting?: string;
    orientation?: string;
};

const SizeChart = ({
    size,
    thickness,
    mounting,
    orientation,
}: Props) => {
    return (
        <div className="mt-4 gap-0.5">
            <Typography variant="label" className="!font-bold">
                Size Chart
            </Typography>

            <ul>
                {size && (
                    <li className="w-full flex justify-between">
                        <Typography variant="label" className="!font-medium">
                            Acrylic Size (Inch)
                        </Typography>
                        <Typography variant="label" className="!font-medium">
                            {size}
                        </Typography>
                    </li>
                )}

                {thickness && (
                    <li className="w-full flex justify-between">
                        <Typography variant="label" className="!font-medium">
                            Thickness
                        </Typography>
                        <Typography variant="label" className="!font-medium">
                            {thickness}
                        </Typography>
                    </li>
                )}

                {mounting && (
                    <li className="w-full flex justify-between">
                        <Typography variant="label" className="!font-medium">
                            Mounting
                        </Typography>
                        <Typography variant="label" className="!font-medium">
                            {mounting}
                        </Typography>
                    </li>
                )}

                {orientation && (
                    <li className="w-full flex justify-between">
                        <Typography variant="label" className="!font-medium">
                            Orientation
                        </Typography>
                        <Typography variant="label" className="!font-medium">
                            {orientation}
                        </Typography>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default SizeChart;