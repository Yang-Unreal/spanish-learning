import { createResource, createSignal, For, Show } from "solid-js";
import DetailModal from "../components/DetailModal";
import Header from "../components/Header";
import WordCard from "../components/WordCard";
import type { Phrase, Word } from "../db/schema";
import { getPhrases } from "../lib/api";

export default function Phrases() {
	const [phrases] = createResource(() => getPhrases());
	const [selectedPhrase, setSelectedPhrase] = createSignal<Phrase | null>(null);

	// Adapter to make Phrase compatible with WordCard which expects Word
	const adaptPhraseToWord = (phrase: Phrase): Word => {
		return {
			...phrase,
			// Provide default values for missing properties
			category: "Abstract", // Default category
			gender: null, // Phrases don't usually have gender in the same way nouns do
			ipa: phrase.ipa || "",
			example: phrase.example || "",
			exampleTranslation: phrase.exampleTranslation || "",
			level: phrase.level || "Basic",
		} as Word;
	};

	return (
		<div class="min-h-screen bg-background pb-20">
			<Header />

			<main class="max-w-7xl mx-auto px-6 pt-8">
				<div class="mb-8">
					<h2 class="text-3xl font-bold text-gray-800 mb-2">Useful Phrases</h2>
					<p class="text-gray-600">
						Common Spanish phrases for daily conversation.
					</p>
				</div>

				{/* Phrases Grid */}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					<Show when={!phrases.loading} fallback={<p>Loading phrases...</p>}>
						<For each={phrases()}>
							{(phrase) => (
								<WordCard
									item={adaptPhraseToWord(phrase)}
									onClick={() => setSelectedPhrase(phrase)}
								/>
							)}
						</For>
					</Show>
				</div>

				<Show when={!phrases.loading && phrases()?.length === 0}>
					<div class="text-center py-10 text-gray-500">
						No phrases found. Please seed the database.
					</div>
				</Show>
			</main>

			{/* Detail Modal */}
			<Show when={selectedPhrase()}>
				{(item) => (
					<DetailModal
						item={adaptPhraseToWord(item())}
						onClose={() => setSelectedPhrase(null)}
					/>
				)}
			</Show>
		</div>
	);
}
