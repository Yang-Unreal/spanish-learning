import { gsap } from "gsap";
import { FiVolume2 } from "solid-icons/fi";
import { onMount } from "solid-js";
import type { VocabularyItem } from "../vocabularyData";

interface WordCardProps {
	item: VocabularyItem;
	onClick: (item: VocabularyItem) => void;
}

export default function WordCard(props: WordCardProps) {
	let cardRef: HTMLDivElement | undefined;
	let translationRef: HTMLDivElement | undefined;
	let audioRef: HTMLButtonElement | undefined;

	const handleMouseEnter = () => {
		if (cardRef && translationRef) {
			gsap.to(cardRef, { scale: 1.05, duration: 0.3, ease: "power2.out" });
			gsap.to(translationRef, {
				opacity: 1,
				y: 0,
				duration: 0.3,
				ease: "power2.out",
			});
		}
	};

	const handleMouseLeave = () => {
		if (cardRef && translationRef) {
			gsap.to(cardRef, { scale: 1, duration: 0.3, ease: "power2.out" });
			gsap.to(translationRef, {
				opacity: 0,
				y: 10,
				duration: 0.3,
				ease: "power2.in",
			});
		}
	};

	const playAudio = (e: MouseEvent) => {
		e.stopPropagation();
		console.log(`Playing audio for: ${props.item.word}`);

		if (audioRef) {
			// Simple "sound wave" animation simulation
			gsap.fromTo(
				audioRef,
				{ scale: 1 },
				{
					scale: 1.2,
					duration: 0.1,
					yoyo: true,
					repeat: 3,
					ease: "power1.inOut",
				},
			);
		}
	};



	onMount(() => {
		// Initial state for translation
		if (translationRef) {
			gsap.set(translationRef, { opacity: 0, y: 10 });
		}
	});

	return (
		<div
			ref={cardRef}
			class="bg-white rounded-2xl shadow-lg overflow-hidden relative transform transition-transform will-change-transform group"
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

			<div class="p-6 flex flex-col items-center justify-center text-center relative z-10 pointer-events-none">
				<h3 class="text-3xl font-bold text-accent mb-2">{props.item.word}</h3>

				<div
					ref={translationRef}
					class="text-xl text-gray-600 font-medium absolute top-16"
				>
					{props.item.translation}
				</div>

				<button
					ref={audioRef}
					type="button"
					class="mt-8 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-300 pointer-events-auto relative z-20"
					onClick={playAudio}
					aria-label="Play pronunciation"
				>
					<FiVolume2 size={24} />
				</button>
			</div>
		</div>
	);
}
