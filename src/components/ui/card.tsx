import { ReactNode } from "react";

export function Card({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`bg-white rounded-xl overflow-hidden shadow ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}
