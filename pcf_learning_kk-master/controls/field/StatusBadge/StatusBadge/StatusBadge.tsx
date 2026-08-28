import * as React from "react";
import { Badge } from "@fluentui/react-components";

export interface IStatusBadgeProps {
    label: string;
}

export const StatusBadge = (
    props: IStatusBadgeProps
): React.ReactElement => {
    return (
        <Badge appearance="tint">
            {props.label}
        </Badge>
    );
};
