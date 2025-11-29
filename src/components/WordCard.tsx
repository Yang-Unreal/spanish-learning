import { gsap } from "gsap";
import { FiVolume2 } from "solid-icons/fi";
import { onCleanup, onMount } from "solid-js";
import type { VocabularyItem } from "../vocabularyData";

interface WordCardProps {
	item: VocabularyItem;
	onClick: (item: VocabularyItem) => void;
}

export default function WordCard(props: WordCardProps) {
	let cardRef: HTMLDivElement | undefined;
	let translationRef: HTMLDivElement | undefined;
	let audioRef: HTMLButtonElement | undefined;

	// Check for reduced motion preference for accessibility (SSR-safe)
	const prefersReducedMotion = typeof window !== "undefined" 
		? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
		: false;
	const animationDuration = prefersReducedMotion ? 0 : 0.2;

	// Shared animation configuration
	const baseAnimConfig = {
		duration: animationDuration,
		force3D: true,
		overwrite: true,
	};

	// Animation helpers
	const animateCard = (scale: number, ease: string, clearProps?: string) => {
		if (!cardRef || typeof window === "undefined") return;
		gsap.to(cardRef, { 
			scale, 
			ease,
			...baseAnimConfig,
			...(clearProps && { clearProps })
		});
	};

	const animateTranslation = (visible: boolean, ease: string) => {
		if (!translationRef || typeof window === "undefined") return;
		gsap.to(translationRef, {
			opacity: visible ? 1 : 0,
			y: visible ? 0 : 10,
			ease,
			...baseAnimConfig
		});
	};

	const handleMouseEnter = () => {
		animateCard(1.05, "power3.out");
		animateTranslation(true, "power3.out");
	};

	const handleMouseLeave = () => {
		animateCard(1, "power3.in", "transform");
		animateTranslation(false, "power3.in");
	};

	const handleAudioButtonEnter = () => {
		if (!cardRef || typeof window === "undefined") return;
		gsap.to(cardRef, { 
			scale: 1.05, 
			ease: "power3.out",
			duration: animationDuration,
			force3D: true,
			overwrite: "auto"
		});
	};

	const playAudio = (e: MouseEvent) => {
		e.stopPropagation();
		const audioUrl = `https://audio1.spanishdict.com/audio?lang=es&text=${encodeURIComponent(props.item.word)}`;
		const audio = new Audio(audioUrl);
		audio.play().catch((err) => console.error("Error playing audio:", err));

		if (audioRef && !prefersReducedMotion && typeof window !== "undefined") {
			gsap.fromTo(
				audioRef,
				{ scale: 1 },
				{
					scale: 1.2,
					duration: 0.1,
					yoyo: true,
					repeat: 3,
					ease: "power1.inOut",
					overwrite: true,
					force3D: true
				},
			);
		}
	};

	onMount(() => {
		if (typeof window === "undefined") return;
		
		if (translationRef) gsap.set(translationRef, { opacity: 0, y: 10 });
		if (cardRef) gsap.set(cardRef, { scale: 1, clearProps: "transform" });
	});

	onCleanup(() => {
		if (typeof window === "undefined") return;
		
		[cardRef, translationRef, audioRef].forEach(ref => {
			if (ref) gsap.killTweensOf(ref);
		});
	});

	return (
		<div
			ref={cardRef}
			class="bg-white rounded-2xl shadow-lg overflow-hidden relative transform will-change-transform group"
		>
			{/* Main Card Action - Overlay Button */}
			<button
				type="button"
				class="absolute inset-0 w-full h-full z-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
				onClick={() => props.onClick(props.item)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				aria-label={`View details for ${props.item.word}`}
			/>

			<div class="h-48 overflow-hidden bg-gray-100 relative z-0 pointer-events-none">
				<img
					src={props.item.image}
					alt={props.item.word}
					class="w-full h-full object-cover"
					width="400"
					height="300"
					loading="lazy"
				/>
			</div>

			<div class="p-6 pb-20 flex flex-col items-center justify-center text-center relative z-10 pointer-events-none">
				<h3 class="text-3xl font-bold text-accent mb-2">{props.item.word}</h3>

				<div
					ref={translationRef}
					class="text-xl text-gray-600 font-medium"
				>
					{props.item.translation}
				</div>
			</div>

			{/* Audio Button - Positioned absolutely to ensure clickability */}
			<button
				ref={audioRef}
				type="button"
				class="absolute bottom-6 left-1/2 transform -translate-x-1/2 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-300 z-30 cursor-pointer"
				onClick={playAudio}
				onMouseEnter={handleAudioButtonEnter} // Keep card scaled when hovering audio
				aria-label="Play pronunciation"
			>
				<FiVolume2 size={24} />
			</button>
		</div>
	);
}
