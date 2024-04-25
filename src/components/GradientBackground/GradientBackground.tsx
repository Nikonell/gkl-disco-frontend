import { useEffect, useRef } from "react";
import "./GradientBackground.css";

export const GradientBackground = () => {
	const interBubble = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
		let curX = 0;
		let curY = 0;
		let tgX = 0;
		let tgY = 0;
		let animationFrame = 0;
	
		function move() {
			if (interBubble.current === null) return;
			curX += (tgX - curX) / 20;
			curY += (tgY - curY) / 20;
			interBubble.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
			animationFrame = requestAnimationFrame(() => {
				move();
			});
		}

		const mouseMoveListener = (event: MouseEvent) => {
			tgX = event.clientX;
			tgY = event.clientY;
		}

		window.addEventListener('mousemove', mouseMoveListener);
		move();

		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('mousemove', mouseMoveListener);
		};
	}, [interBubble.current]);

    return <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                    <feBlend in="SourceGraphic" in2="goo" />
                </filter>
            </defs>
        </svg>
        <div className="gradients-container">
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <div className="g5"></div>
            <div className="interactive" ref={interBubble}></div>
        </div>
    </div>
}