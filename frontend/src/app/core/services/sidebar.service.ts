import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isSlim = signal(false);

  toggle() {
    this.isSlim.update(v => !v);
  }

  setSlim(value: boolean) {
    this.isSlim.set(value);
  }
}
