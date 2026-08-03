import { Component, signal, inject } from '@angular/core';
import { AudioService } from '../audio.service';

interface MemoryCard {
  id: number;
  title: string;
  emoji: string;
  desc: string;
  details: string;
  colorClass: string;
  image1: string;
  image1Caption: string;
  image2: string;
  image2Caption: string;
  image3: string;
  image3Caption: string;
  image4: string;
  image4Caption: string;
}

@Component({
  selector: 'app-homepage',
  imports: [],
  template: `
    <div class="homepage-container flex flex-col justify-between h-full p-4 select-none relative overflow-y-auto">
      
      <!-- Top Title Bar -->
      <div class="w-full text-center mt-2 flex flex-col items-center">
        <!-- Tiny Bow Decoration -->
        <div class="w-12 h-8 mb-2 animate-bounce">
          <svg viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 1h16M2 2h2m16 0h2M1 4h1m20 0h1M1 6h1m20 0h1M2 8h2m16 0h2M4 9h16" stroke="#4a0e17" stroke-width="1.2"/>
            <rect x="2" y="2" width="7" height="6" fill="#ff2a54"/>
            <rect x="15" y="2" width="7" height="6" fill="#ff2a54"/>
            <rect x="10" y="3" width="4" height="4" fill="#ffd166"/>
            <rect x="9" y="3" width="1" height="4" stroke="#4a0e17" stroke-width="1"/>
            <rect x="14" y="3" width="1" height="4" stroke="#4a0e17" stroke-width="1"/>
          </svg>
        </div>
        
        <h1 class="text-[10px] md:text-[12px] font-pixel leading-normal text-[var(--hk-text)] tracking-wider px-2 max-w-lg">
          WELCOME ANGEL!<br>PLEASE SELECT ANY MEMORIES BELOW TO START
        </h1>
      </div>

      <!-- Memory Cartridge Grid -->
      <div class="grid grid-cols-2 gap-4 max-w-md w-full mx-auto my-6 px-1">
        @for (card of memoryCards; track card.id) {
          <button type="button" 
                  class="pixel-border-md bg-[var(--hk-cream)] p-3 flex flex-col items-center justify-between text-center gap-2 cursor-pointer transition-transform duration-100 hover:scale-105 active:scale-95 shadow-[4px_4px_0_var(--hk-text)] hover:shadow-[6px_6px_0_var(--hk-text)]"
                  [style.border-color]="'var(--hk-text)'"
                  (click)="selectMemory(card)">
            
            <!-- Game Cartridge Label Details -->
            <div class="w-full flex justify-between px-1 text-[8px] font-pixel text-[var(--hk-text)] opacity-60">
              <span>M-0{{card.id}}</span>
              <span>16-BIT</span>
            </div>

            <!-- Memory icon/sticker area -->
            <div class="w-14 h-14 rounded flex items-center justify-center text-3xl my-1"
                 [class]="card.colorClass">
              {{card.emoji}}
            </div>

            <!-- Cartridge Title -->
            <span class="text-xs md:text-sm font-semibold tracking-wide text-[var(--hk-text)]">
              {{card.title}}
            </span>

            <span class="text-[8px] font-pixel text-[var(--hk-text)] border-t border-dashed border-[#4a0e17] pt-1 w-full opacity-70">
              {{ card.id === 4 ? '▶ MAINT' : '▶ LOAD' }}
            </span>
          </button>
        }
      </div>

      <!-- Bottom HUD Status Bar (Fixed retro layout) -->
      <div class="pixel-border-md bg-[#fffafb] p-3 max-w-md w-full mx-auto flex items-center justify-between text-[8px] md:text-[10px] font-pixel shadow-[4px_4px_0_rgba(0,0,0,0.1)] gap-2">
        <div class="flex items-center gap-1">
          <span class="text-pink-500">👑</span>
          <span>P1: ANGEL</span>
        </div>
        <div class="flex items-center gap-1">
          <span>LV: 99</span>
        </div>
        <div class="flex items-center gap-1">
          <span>HP:</span>
          <span class="pulse-heart text-red-500">💖💖💖</span>
        </div>
        <div>
          <!-- Mute/Unmute BGM controls -->
          <button type="button" 
                  class="pixel-border-sm bg-[var(--hk-pink-soft)] hover:bg-[var(--hk-pink-light)] px-2 py-1 text-[8px] font-pixel cursor-pointer"
                  (click)="toggleSound()">
            {{ audioService.isMuted() ? '🔇 MUTE' : '🔊 BGM' }}
          </button>
        </div>
      </div>

      <!-- Fullscreen Memory Overlay Screen -->
      @if (selectedCard(); as card) {
        <div class="fixed inset-0 bg-[#ffe5ec] z-50 overflow-y-auto flex flex-col p-4 sm:p-8 animate-in fade-in duration-200">
          
          <!-- Top Navigation & Title Bar -->
          <div class="max-w-4xl w-full mx-auto flex justify-between items-center pb-4 border-b-4 border-dashed border-[#4a0e17] mb-6">
            <button type="button" 
                    class="pixel-btn pixel-btn-yellow text-[9px] md:text-xs py-2 px-4 flex items-center gap-2"
                    (click)="closeMemory()">
              ◀ BACK TO MAIN MENU
            </button>
            
            <div class="flex items-center gap-2">
              <span class="text-xl animate-bounce">🎀</span>
              <span class="text-[9px] font-pixel text-[var(--hk-text)] font-semibold hidden sm:inline">MEMORY PLAYBACK</span>
            </div>
          </div>

          @if (card.id === 4) {
            <!-- Special 8-Bit Maintenance screen for card 4! -->
            <div class="flex-grow flex flex-col items-center justify-center max-w-4xl w-full mx-auto p-4 md:p-8 animate-in fade-in duration-300">
              <div class="w-full bg-[#1b1215] pixel-border-lg p-6 md:p-10 relative overflow-hidden shadow-[8px_8px_0_var(--hk-text)] crt-screen flex flex-col items-center text-center gap-6 md:gap-8 justify-center min-h-[420px]">
                
                <!-- Hazard Stripe Header -->
                <div class="w-full h-3 flex overflow-hidden pixel-border-sm relative">
                  <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffd166,#ffd166_10px,#4a0e17_10px,#4a0e17_20px)]"></div>
                </div>

                <!-- Animated retro warning light + alert sign -->
                <div class="relative mt-2">
                  <div class="w-20 h-20 md:w-24 md:h-24 animate-pulse flex items-center justify-center">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full filter drop-shadow-[0_0_12px_rgba(255,209,102,0.6)]">
                      <polygon points="50,15 90,85 10,85" fill="#ffd166" stroke="#4a0e17" stroke-width="7" stroke-linejoin="miter" />
                      <rect x="46" y="38" width="8" height="24" fill="#4a0e17" />
                      <rect x="46" y="68" width="8" height="8" fill="#4a0e17" />
                    </svg>
                  </div>
                  <!-- Warning label flashing -->
                  <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#ff2a54] text-white px-2 py-0.5 text-[8px] font-pixel whitespace-nowrap pixel-border-sm animate-bounce">
                    SYSTEM HOLD
                  </div>
                </div>

                <!-- Main message & console screen window -->
                <div class="w-full max-w-lg bg-[#271b1f] pixel-border-md p-4 md:p-6 flex flex-col gap-4 text-left shadow-inner">
                  <div class="text-[9px] md:text-xs font-pixel text-[#ff85a1] border-b border-dashed border-[#ff85a1]/30 pb-2 flex items-center justify-between">
                    <span>> SELECT CHAPTER 04</span>
                    <span class="text-[#ffd166] animate-pulse">DEV_BUILD</span>
                  </div>

                  <!-- The primary text -->
                  <p class="text-xs md:text-sm font-pixel text-[#ffd166] leading-relaxed py-2">
                    "We have yet to complete this chapter."<span class="pixel-cursor text-white"></span>
                  </p>

                  <!-- Animated Progress bar -->
                  <div class="flex flex-col gap-1.5 mt-2">
                    <div class="text-[7px] md:text-[8px] font-pixel text-zinc-400 flex justify-between">
                      <span>BUILD_STATE: IN_PROGRESS</span>
                      <span class="animate-pulse">LOADING... 52%</span>
                    </div>
                    <!-- Progress Bar Frame -->
                    <div class="h-5 w-full bg-[#1b1215] pixel-border-sm p-1 flex items-center">
                      <div class="h-full bg-[#ff2a54] flex animate-[pulse_1s_infinite_alternate]" style="width: 52%">
                        <div class="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(74,14,23,0.3)_4px,rgba(74,14,23,0.3)_8px)]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- System details info table -->
                <div class="w-full max-w-lg grid grid-cols-2 gap-2 text-left text-[7px] md:text-[8px] font-pixel text-zinc-400 px-2">
                  <div>SYS: ANGEL-OS v9.9</div>
                  <div class="text-right">SECTOR: 0xDEADBEEF</div>
                </div>

                <!-- Hazard Stripe Footer -->
                <div class="w-full h-3 flex overflow-hidden pixel-border-sm relative mt-2">
                  <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffd166,#ffd166_10px,#4a0e17_10px,#4a0e17_20px)]"></div>
                </div>

              </div>
            </div>
          } @else {
            <!-- Top Horizontal Image Row (Images 1 and 2 side-by-side) -->
            <div class="max-w-4xl w-full mx-auto grid grid-cols-2 gap-4 mb-6">
              
              <!-- Image 1 -->
              <div class="pixel-img-frame">
                <div class="w-full aspect-square bg-pink-50 relative overflow-hidden pixel-border-sm flex items-center justify-center">
                  <img [src]="card.image1" [alt]="card.image1Caption" class="w-full h-full object-cover">
                </div>
                <span class="pixel-img-caption">
                  @let cap1 = splitCaption(card.image1Caption);
                  {{ cap1.text }} <span class="pixel-caption-emoji">{{ cap1.emoji }}</span>
                </span>
              </div>

              <!-- Image 2 -->
              <div class="pixel-img-frame">
                <div class="w-full aspect-square bg-pink-50 relative overflow-hidden pixel-border-sm flex items-center justify-center">
                  <img [src]="card.image2" [alt]="card.image2Caption" class="w-full h-full object-cover">
                </div>
                <span class="pixel-img-caption">
                  @let cap2 = splitCaption(card.image2Caption);
                  {{ cap2.text }} <span class="pixel-caption-emoji">{{ cap2.emoji }}</span>
                </span>
              </div>

            </div>

            <!-- Central Story Telling Container (Full screen width) -->
            <div class="max-w-4xl w-full mx-auto bg-[var(--hk-cream)] pixel-border-lg p-6 md:p-8 shadow-[6px_6px_0_rgba(74,14,23,0.15)] flex flex-col gap-6 mb-6">
              
              <div class="flex justify-between items-center">
                <span class="text-[8px] font-pixel text-[#ff2a54] pulse-heart">● PLAYING BACK</span>
                <span class="text-[8px] font-pixel text-[var(--hk-text)] opacity-70">FILE: MEM_0{{card.id}}</span>
              </div>

              <h2 class="text-xs md:text-sm font-pixel text-[#ff477e] leading-normal tracking-wide border-b-4 border-double border-[#4a0e17] pb-3 text-center">
                ✨ {{ card.title }} ✨
              </h2>

              <p class="text-sm md:text-base text-[var(--hk-text)] leading-relaxed font-semibold whitespace-pre-line p-3 max-h-[300px] overflow-y-auto bg-[var(--hk-pink-soft)] pixel-border-sm">
                {{ card.details }}
              </p>

              <div class="text-[8px] font-pixel text-[var(--hk-text)] opacity-70 text-center border-t border-dashed border-[#4a0e17] pt-3">
                LOVE LEVEL 100% ALWAYS 💖
              </div>

            </div>

            <!-- Bottom Horizontal Image Row (Images 3 and 4 side-by-side) -->
            <div class="max-w-4xl w-full mx-auto grid grid-cols-2 gap-4 pb-12">
              
              <!-- Image 3 -->
              <div class="pixel-img-frame">
                <div class="w-full aspect-square bg-pink-50 relative overflow-hidden pixel-border-sm flex items-center justify-center">
                  <img [src]="card.image3" [alt]="card.image3Caption" class="w-full h-full object-cover">
                </div>
                <span class="pixel-img-caption">
                  @let cap3 = splitCaption(card.image3Caption);
                  {{ cap3.text }} <span class="pixel-caption-emoji">{{ cap3.emoji }}</span>
                </span>
              </div>

              <!-- Image 4 -->
              <div class="pixel-img-frame">
                <div class="w-full aspect-square bg-pink-50 relative overflow-hidden pixel-border-sm flex items-center justify-center">
                  <img [src]="card.image4" [alt]="card.image4Caption" class="w-full h-full object-cover">
                </div>
                <span class="pixel-img-caption">
                  @let cap4 = splitCaption(card.image4Caption);
                  {{ cap4.text }} <span class="pixel-caption-emoji">{{ cap4.emoji }}</span>
                </span>
              </div>

            </div>
          }

        </div>
      }

    </div>
  `
})
export class HomepageComponent {
  readonly audioService = inject(AudioService);
  
  // Track selected memory card reactively
  readonly selectedCard = signal<MemoryCard | null>(null);

  // Set up kawaii memories with unique image path lists
  readonly memoryCards: MemoryCard[] = [
    {
      id: 1,
      title: 'At First Glance',
      emoji: '🌸',
      desc: 'The beginning of us...',
      details: 'We first met on leo, and to be truthful I was not in my right mind back then, my intention were far from pure, I was a naughty teenager whom thought getting laid will make me look cool and mature. Smoking cigarettes, vaping and also fell into drugs. I was a lost kid, no future thoughts even crossed my mind, was a non-believer and had major anger issues.\n\nThat\'s when I met you. At first glance I actually felt flabbergasted when we first matched, that\'s when I first felt what falling in love feels like. As we spoke more and share interests and stories, I fell for you even more and more.\n\nText after text we finally scheduled our very first date! We went to Imago for our first date, and I was so nervous! My hands were shaking, and I that time I was trying so hard to look cool and nonchalant. But the moment you looked at me and smiled, gosh did my heart melt at that very moment.\n\nWe walked around the mall, talking about anything and everything. The sun was warm, and the weather was nice. I knew right then and there that you were someone very special when you did not hesitate to laugh to share stories with me even though I was a bit weird and skinny at that time. Despite my skeleton look and I was vaping as well in front of you and you still stayed showing interest to me, made the little kid that never felt love came out. That\'s when we first held hands as well, gosh did that pump so much adrenaline into my heart. It was one of the very mandatory and best moments ever in my life and I hope it is as well for you!\n\nEvery time I think about that day, it still makes me smile. It was the best start to our story, and I still get butterflies when I think about it! Especially when you gave me the bracelet and bought me the sweater from uniqlo that I still took care and wear to this day!',
      colorClass: 'bg-pink-100',
      image1: 'images/FirstDate-8bit.png',
      image1Caption: 'Happy Us 🌸',
      image2: 'images/HeldHands-8bit.png',
      image2Caption: 'Hand in Hand ❤️',
      image3: 'images/Eats-8bit.png',
      image3Caption: 'Snack Time 🍎',
      image4: 'images/FirstBooth-8bit.png',
      image4Caption: 'First Photobooth 📸'
    },
    {
      id: 2,
      title: 'Food Adventures',
      emoji: '🍛',
      desc: 'Yummylicious food...',
      details: 'If it\'s one thing that we love alot, it is our love and passion for foods! So many places we have visited, dine together, takeout together, etc. So time spent together and every second, every minute and every hour I cherished.\n\nFrom places to places, ratings after ratings and eating experience after another will never dissapoint me especially when I am doing it with you beside me. We are like Batman and Robin except we hunt for food and snacks instead of criminals!\n\nHere\'s hoping that we can keep this going for as long as we can until grew old together! Nonetheless, I pray to the almighty father that our relationship will bond forever and ever, and our love for eachother will be as much as our love for one another, Love you always babe 💖',
      colorClass: 'bg-blue-100',
      image1: 'images/Matcha-8bit.png',
      image1Caption: 'Matcha Love ☕',
      image2: 'images/Grill-8bit.png',
      image2Caption: 'Lunch Time 🥩',
      image3: 'images/Kyochon-8bit.png',
      image3Caption: 'Korean Chicken 🍗',
      image4: 'images/Me-8bit.png',
      image4Caption: 'Your Foodie Partner 💖'
    },
    {
      id: 3,
      title: 'Sweet Moments',
      emoji: '🧁',
      desc: 'Inside jokes & hugs...',
      details: 'Every little joke we share, every warm hug, and the way you always bring me up when I\'m down, the effort you put into making me the way I am can\'t ever go unrecognized for a single day. Doing anything with you gives me hope in life, gives me a reason to keep going. You gave my life a beautiful garden and I am so grateful for each pluck of flower that grew in this garden. After meeting with some of your families, I knew my life is complete since they saw me, greeted me with open arms and accepted me as part of the family. I can never ask for more.\n\nDespite all the struggles, arguments and fights we\'ve been through, nothing can ever break our bluetooth connection. I love the quiet moments we share together, just sitting or lying next to each other with nothing to talk about just us reminiscing at each other. You make my life so sweet and happy, like a warm cupcake on a rainy day.\n\nThank you for always being there for me and making me feel so loved every single day!',
      colorClass: 'bg-yellow-100',
      image1: 'images/Kish-8bit.png',
      image1Caption: 'Kish Kish 😽',
      image2: 'images/Silly-8bit.png',
      image2Caption: 'Silly Moment 🤪',
      image3: 'images/Kundasang-8bit.png',
      image3Caption: 'Kundasang Trip ⛰️',
      image4: 'images/FamilyMeets-8bit.png',
      image4Caption: 'Family Meets 👨‍👩‍👧‍👦'
    },
    {
      id: 4,
      title: 'My Traveling Partner',
      emoji: '✈️',
      desc: 'Under maintenance...',
      details: 'All the lovely places we have traveled to and all the beautiful journeys ahead of us. We have walked so many paths together, and I have loved every single step.\n\nThere is no one else I would rather explore the world and play the game of life with. Whether we are going somewhere far away or just walking down the street, it is always an adventure with you.\n\nI cannot wait to travel to new places and make many more happy memories with you!',
      colorClass: 'bg-green-100',
      image1: 'images/adventures_1.png',
      image1Caption: 'Adventures ✈️',
      image2: 'images/adventures_2.png',
      image2Caption: 'Calling Home 📞',
      image3: 'images/adventures_3.png',
      image3Caption: 'Forever ❤️',
      image4: 'images/adventures_4.png',
      image4Caption: 'Love Notes ✉️'
    }
  ];

  selectMemory(card: MemoryCard) {
    this.audioService.playSelect();
    this.selectedCard.set(card);
  }

  closeMemory() {
    this.audioService.playBlip();
    this.selectedCard.set(null);
  }

  toggleSound() {
    this.audioService.toggleMute();
  }

  splitCaption(caption: string) {
    const lastSpaceIndex = caption.lastIndexOf(' ');
    if (lastSpaceIndex === -1) {
      return { text: caption, emoji: '' };
    }
    return {
      text: caption.substring(0, lastSpaceIndex),
      emoji: caption.substring(lastSpaceIndex + 1)
    };
  }
}
