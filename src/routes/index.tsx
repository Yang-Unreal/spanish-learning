import { type InfiniteData, useInfiniteQuery } from "@tanstack/solid-query";
import { gsap } from "gsap";
import { FiZap } from "solid-icons/fi";
import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import DetailModal from "../components/DetailModal";
import WordCard from "../components/WordCard";
import type { Word } from "../db/schema";
import { getWords } from "../lib/api";

export default function Home() {
	// State
	const [currentLevel, setCurrentLevel] = createSignal<
		"Basic" | "Intermediate" | "Advanced"
	>("Basic");
	const [selectedCategory, setSelectedCategory] = createSignal<string>("All");
	const [selectedWord, setSelectedWord] = createSignal<Word | null>(null);

	// Data
	const query = useInfiniteQuery<
		Word[],
		Error,
		InfiniteData<Word[]>,
		[string, string, string],
		number
	>(() => ({
		queryKey: ["words", currentLevel(), selectedCategory()],
		queryFn: async ({ pageParam }) => {
			return getWords(pageParam, 20, currentLevel(), selectedCategory());
		},
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === 20 ? allPages.length + 1 : undefined;
		},
		initialPageParam: 1,
		placeholderData: (previousData) => previousData,
		staleTime: 1000 * 60 * 5, // 5 minutes
	}));

	// Refs
	let categoryRailRef: HTMLDivElement | undefined;
	let cardsContainerRef: HTMLDivElement | undefined;
	let levelPillRef: HTMLDivElement | undefined;
	let loadMoreRef: HTMLDivElement | undefined;

	// Intersection Observer for Infinite Scroll
	createEffect(() => {
		if (!loadMoreRef) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					query.hasNextPage &&
					!query.isFetchingNextPage
				) {
					query.fetchNextPage();
				}
			},
			{ threshold: 0.5 },
		);

		observer.observe(loadMoreRef);
		onCleanup(() => observer.disconnect());
	});

	// Derived Data
	const flattenedWords = () => query.data?.pages.flat() || [];

	const categories = [
		"All",
		"Greetings",
		"Food",
		"Travel",
		"Family",
		"Nature",
		"Grammar",
		"Verbs",
		"Common Nouns",
		"Time & Numbers",
		"People",
		"Society",
		"Abstract",
		"Adjectives",
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
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[600px] items-start transition-opacity duration-300"
					style={{ opacity: query.isFetching && flattenedWords().length === 0 ? 0.5 : 1 }}
				>
					<For each={flattenedWords()}>
						{(item) => (
							<WordCard item={item} onClick={(item) => setSelectedWord(item)} />
						)}
					</For>
				</div>

				{/* Loading / Empty State */}
				<div ref={loadMoreRef} class="py-10 text-center">
					<Show when={query.isFetchingNextPage}>
						<p class="text-gray-500">Loading more...</p>
					</Show>
					<Show when={!query.hasNextPage && flattenedWords().length > 0}>
						<p class="text-gray-400">No more words to load.</p>
					</Show>
					<Show when={flattenedWords().length === 0 && !query.isFetching && !query.isLoading}>
						<p class="text-gray-400 text-lg">
							No words found for this category.
						</p>
					</Show>
					<Show when={query.isLoading && flattenedWords().length === 0}>
						<p class="text-gray-500">Loading...</p>
					</Show>
				</div>
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
