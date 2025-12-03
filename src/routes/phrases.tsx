import { FiVolume2 } from "solid-icons/fi";
import { createResource, For, Show } from "solid-js";
import Header from "../components/Header";
import type { Phrase } from "../db/schema";
import { getPhrases } from "../lib/api";

export default function Phrases() {
	const [phrases] = createResource(() => getPhrases());

	const playAudio = (text: string) => {
		const audioUrl = `https://audio1.spanishdict.com/audio?lang=es&text=${encodeURIComponent(text)}`;
		const audio = new Audio(audioUrl);
		audio.play().catch((err) => console.error("Error playing audio:", err));
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

				{/* Phrases List */}
				<div
					class="bg-white rounded-2xl shadow-lg overflow-hidden"
					style={{ opacity: phrases.loading ? 0.5 : 1 }}
				>
					<Show when={phrases()?.length === 0 && !phrases.loading}>
						<div class="text-center py-10 text-gray-500">
							No phrases found. Please seed the database.
						</div>
					</Show>
					<Show when={(phrases()?.length ?? 0) > 0}>
						<ul class="divide-y divide-gray-200">
							<For each={phrases()}>
								{(phrase: Phrase) => (
									<li class="hover:bg-gray-50 transition-colors duration-200">
										<div class="px-6 py-4 flex items-center justify-between gap-4">
											<div class="flex-1">
												<div class="text-xl font-bold text-accent mb-1">
													{phrase.word}
												</div>
												<div class="text-lg text-gray-600">
													{phrase.translation}
												</div>
											</div>
											<button
												type="button"
												class="shrink-0 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
												onClick={() => playAudio(phrase.word)}
												aria-label={`Play pronunciation for ${phrase.word}`}
											>
												<FiVolume2 size={24} />
											</button>
										</div>
									</li>
								)}
							</For>
						</ul>
					</Show>
				</div>
			</main>
		</div>
	);
}
