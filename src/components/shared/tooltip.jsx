import { useLayoutEffect, useRef, useState } from "react";
import { useTooltip } from "../../tooltipcontext";

function Tooltip() {
    const { isTooltipOpen, tooltipContent } = useTooltip();
    const ref = useRef(null);
    const [position, setPosition] = useState(null);

    // The tooltip's size is only known after it renders, so measure it before
    // paint and clamp the position into the viewport.
    useLayoutEffect(() => {
        if (!isTooltipOpen || !tooltipContent || !ref.current) {
            return;
        }

        const anchor = tooltipContent.rect;
        const tip = ref.current.getBoundingClientRect();
        const margin = 5;

        let left = anchor.x + anchor.width + margin;
        if (left + tip.width > window.innerWidth - margin) {
            // No room on the right, flip to the left side of the anchor.
            left = Math.max(margin, anchor.x - tip.width - margin);
        }

        let top = anchor.y;
        if (top + tip.height > window.innerHeight - margin) {
            // Overflowing the bottom, shift up until it fits.
            top = Math.max(margin, window.innerHeight - tip.height - margin);
        }

        setPosition({ left, top });
    }, [isTooltipOpen, tooltipContent]);

    if (!isTooltipOpen) {
        return null;
    }

    return (
        <div ref={ref} className="tooltip" style={{
            left: position?.left ?? tooltipContent.rect.x + tooltipContent.rect.width + 5,
            top: position?.top ?? tooltipContent.rect.y,
            visibility: position ? "visible" : "hidden"
        }}>
            {tooltipContent.text}
        </div>
    );
}

export default Tooltip;
