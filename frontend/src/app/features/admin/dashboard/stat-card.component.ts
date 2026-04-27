import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-0.5 bg-gradient-to-r rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500"
           [ngClass]="glowClass()"></div>
      
      <!-- Card Content -->
      <div class="relative bg-white dark:bg-[#1e293b] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden h-full">
          <!-- Background Pattern / Glass Effect -->
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full blur-2xl"></div>

          <div class="flex justify-between items-start mb-4">
              <div class="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform duration-500">
                  <div class="w-6 h-6 flex items-center justify-center" [innerHTML]="icon()"></div>
              </div>
              @if (trend()) {
                <div class="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1"
                     [ngClass]="trend()! > 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'">
                  {{ trend()! > 0 ? '▲' : '▼' }} {{ trend() }}%
                </div>
              }
          </div>

          <h3 class="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{{ label() }}</h3>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-gray-900 dark:text-white font-outfit">{{ value() }}</span>
            @if (suffix()) {
              <span class="text-gray-400 dark:text-gray-600 font-bold text-lg">{{ suffix() }}</span>
            }
          </div>

          <!-- Bottom Visual (Chart Placeholder) -->
          <div class="mt-6 h-12 flex items-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
             @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div class="flex-grow rounded-full transition-all duration-700"
                     [ngClass]="glowClass().split(' ')[1]"
                     [style.height.%]="(Math.random() * 60) + 40"></div>
             }
          </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  icon = input.required<string>();
  trend = input<number>();
  suffix = input<string>();
  color = input<'rose' | 'purple' | 'blue' | 'emerald'>('purple');

  Math = Math;

  glowClass() {
    const colors = {
      rose: 'from-rose-500 to-orange-500 bg-rose-500',
      purple: 'from-purple-500 to-indigo-500 bg-purple-500',
      blue: 'from-blue-500 to-cyan-500 bg-blue-500',
      emerald: 'from-emerald-500 to-teal-500 bg-emerald-500',
    };
    return colors[this.color()];
  }
}
