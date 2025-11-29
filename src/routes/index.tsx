import { gsap } from "gsap";
import { FiZap } from "solid-icons/fi";
import { createSignal, For, Show } from "solid-js";
import DetailModal from "../components/DetailModal";
import WordCard from "../components/WordCard";
import { type VocabularyItem, vocabularyData } from "../vocabularyData";

export default function Home() {
	// State
	const [currentLevel, setCurrentLevel] = createSignal<
		"Basic" | "Intermediate" | "Advanced"
	>("Basic");
	const [selectedCategory, setSelectedCategory] = createSignal<string>("All");
	const [selectedWord, setSelectedWord] = createSignal<VocabularyItem | null>(
		null,
	);

	// Refs
	let categoryRailRef: HTMLDivElement | undefined;
	let cardsContainerRef: HTMLDivElement | undefined;
	let levelPillRef: HTMLDivElement | undefined;

	// Derived Data
	const filteredWords = () => {
		return vocabularyData.filter((item) => {
			const levelMatch = item.level === currentLevel();
			const categoryMatch =
				selectedCategory() === "All" || item.category === selectedCategory();
			return levelMatch && categoryMatch;
		});
	};

	const categories = [
		"All",
		...new Set(vocabularyData.map((item) => item.category)),
	];
	const levels = ["Basic", "Intermediate", "Advanced"] as const;

	// Animations


	const handleLevelChange = (level: (typeof levels)[number], index: number) => {
		setCurrentLevel(level);
		if (levelPillRef) {
			// Animate the pill background
			// Assuming each pill is roughly equal width, we can calculate position
			// For a more robust solution, we'd query the specific button element
			const widthPercent = 100 / levels.length;
			gsap.to(levelPillRef, {
				left: `${index * widthPercent}%`,
				duration: 0.4,
				ease: "elastic.out(1, 0.8)",
			});
		}
	};

	return (
		<div class="min-h-screen bg-background pb-20">
			{/* Sticky Header */}
			<header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
						H
					</div>
					<h1 class="text-2xl font-bold text-accent tracking-tight">Hablo</h1>
				</div>

				<div class="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
					<FiZap class="text-orange-500" />
					<span class="font-bold text-orange-600">12 Day Streak</span>
				</div>
			</header>

			<main class="max-w-7xl mx-auto px-6 pt-8">
				{/* Level Switcher */}
				<div class="flex justify-center mb-10">
					<div class="bg-gray-200 p-1 rounded-full relative flex w-full max-w-md">
						{/* Active Pill Background */}
						<div
							ref={levelPillRef}
							class="absolute top-1 bottom-1 left-0 w-1/3 bg-white rounded-full shadow-sm z-0"
						/>

						<For each={levels}>
							{(level, index) => (
								<button
									type="button"
									class={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors duration-300 ${
										currentLevel() === level
											? "text-accent"
											: "text-gray-500 hover:text-gray-700"
									}`}
									onClick={() => handleLevelChange(level, index())}
								>
									{level}
								</button>
							)}
						</For>
					</div>
				</div>

				{/* Category Rail */}
				<div class="mb-8 overflow-x-auto pb-4 scrollbar-hide">
					<div ref={categoryRailRef} class="flex gap-3 min-w-max px-1">
						<For each={categories}>
							{(category) => (
								<button
									type="button"
									class={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 border ${
										selectedCategory() === category
											? "bg-accent text-white shadow-lg shadow-accent/20 border-transparent"
											: "bg-white text-gray-600 hover:bg-gray-50 border-gray-100"
									}`}
									onClick={() => setSelectedCategory(category)}
								>
									{category}
								</button>
							)}
						</For>
					</div>
				</div>

				{/* Vocabulary Grid */}
				<div
					ref={cardsContainerRef}
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					<For each={filteredWords()}>
						{(item) => (
							<WordCard item={item} onClick={(item) => setSelectedWord(item)} />
						)}
					</For>
				</div>

				{/* Empty State */}
				<Show when={filteredWords().length === 0}>
					<div class="text-center py-20">
						<p class="text-gray-400 text-lg">
							No words found for this category.
						</p>
					</div>
				</Show>
			</main>

			{/* Detail Modal */}
			<Show when={selectedWord()}>
				{(item) => (
					<DetailModal item={item()} onClose={() => setSelectedWord(null)} />
				)}
			</Show>
		</div>
	);
}
