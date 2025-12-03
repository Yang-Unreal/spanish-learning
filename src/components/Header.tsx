import { A } from "@solidjs/router";

export default function Header() {
  return (
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <A href="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <h1 class="text-2xl font-bold text-accent tracking-tight">Hablo</h1>
        </A>

        <nav class="flex items-center gap-6">
          <A 
            href="/" 
            class="font-medium text-gray-600 hover:text-accent transition-colors"
            activeClass="text-accent font-bold"
            end
          >
            Words
          </A>
          <A 
            href="/phrases" 
            class="font-medium text-gray-600 hover:text-accent transition-colors"
            activeClass="text-accent font-bold"
          >
            Phrases
          </A>
        </nav>
      </div>
    </header>
  );
}
