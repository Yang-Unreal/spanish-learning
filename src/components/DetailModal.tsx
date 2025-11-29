import { gsap } from "gsap";
import { FiVolume2, FiX } from "solid-icons/fi";
import { createSignal, onMount, Show } from "solid-js";
import type { VocabularyItem } from "../vocabularyData";

interface DetailModalProps {
  item: VocabularyItem;
  onClose: () => void;
}

export default function DetailModal(props: DetailModalProps) {
  let overlayRef: HTMLButtonElement | undefined;
  let contentRef: HTMLDivElement | undefined;
  const [activeTab, setActiveTab] = createSignal<"Usage" | "Grammar" | "Examples">("Usage");

  const close = () => {
    if (overlayRef && contentRef) {
      const tl = gsap.timeline({ onComplete: props.onClose });
      tl.to(contentRef, {
        scale: 0.8,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      }).to(overlayRef, { opacity: 0, duration: 0.2 }, "-=0.1");
    } else {
      props.onClose();
    }
  };

  const handleOverlayKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      close();
    }
  };

  onMount(() => {
    if (overlayRef && contentRef) {
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      ).fromTo(
        contentRef,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.75)" },
        "-=0.1",
      );
    }
  });

  const playAudio = () => {
    const audioUrl = `https://audio1.spanishdict.com/audio?lang=es&text=${encodeURIComponent(props.item.word)}`;
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.error("Error playing audio:", err));
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <button
        ref={overlayRef}
        type="button"
        class="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer w-full h-full border-none p-0 m-0"
        onClick={close}
        onKeyDown={handleOverlayKeyDown}
        aria-label="Close modal"
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={close}
          class="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-20"
          aria-label="Close"
        >
          <FiX size={24} class="text-gray-600" />
        </button>

        {/* Hero Section */}
        <div class="bg-primary/5 p-8 text-center relative">
          <h2 class="text-5xl font-bold text-accent mb-2">{props.item.word}</h2>
          <div class="flex items-center justify-center gap-3 text-gray-500 text-xl">
            <span>{props.item.ipa}</span>
            <button
              type="button"
              onClick={playAudio}
              class="text-primary hover:scale-110 transition-transform"
              aria-label="Play pronunciation"
            >
              <FiVolume2 size={20} />
            </button>
          </div>
          <p class="text-2xl font-medium text-gray-700 mt-2">
            {props.item.translation}
          </p>

          <Show when={props.item.gender}>
            <div
              class={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-4 ${
                props.item.gender === "Masculine"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-pink-100 text-pink-700"
              }`}
            >
              {props.item.gender}
            </div>
          </Show>
        </div>

        {/* Tabs */}
        <div class="flex border-b border-gray-100 px-8">
          {(["Usage", "Grammar", "Examples"] as const).map((tab) => (
            <button
              type="button"
              class={`py-4 px-6 font-medium text-lg transition-colors relative ${
                activeTab() === tab
                  ? "text-primary"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <Show when={activeTab() === tab}>
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              </Show>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div class="p-8 overflow-y-auto">
          <Show when={activeTab() === "Usage"}>
            <div class="space-y-4">
              <h4 class="text-lg font-bold text-accent">Common Usage</h4>
              <p class="text-gray-600 leading-relaxed">
                "{props.item.word}" is a fundamental word in Spanish, commonly used in{" "}
                {props.item.category.toLowerCase()} contexts. It is essential for
                daily communication.
              </p>
            </div>
          </Show>

          <Show when={activeTab() === "Grammar"}>
            <div class="space-y-4">
              <h4 class="text-lg font-bold text-accent">Grammatical Notes</h4>
              <p class="text-gray-600">
                Level:{" "}
                <span class="font-bold text-primary">{props.item.level}</span>
              </p>
              <Show when={props.item.gender}>
                <p class="text-gray-600">
                  Gender: <span class="font-bold">{props.item.gender}</span>
                </p>
              </Show>
            </div>
          </Show>

          <Show when={activeTab() === "Examples"}>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
              <div>
                <p class="text-xl text-accent font-medium italic mb-2">
                  "{props.item.example}"
                </p>
                <p class="text-lg text-gray-600">
                  {props.item.exampleTranslation}
                </p>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
