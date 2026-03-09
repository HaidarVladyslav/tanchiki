import { computed, Injectable, signal } from '@angular/core';
import { ControllerState } from './types/controller-state';
import { Direction } from './types/direction';

const KEY_MAP: { [key: string]: Direction } = {
  ArrowRight: 'right',
  ArrowLeft: 'left',
  ArrowUp: 'top',
  ArrowDown: 'bottom',
};

@Injectable({ providedIn: 'root' })
export class Controller {
  private state = signal<ControllerState>({
    top: { pressed: false },
    bottom: { pressed: false },
    left: { pressed: false },
    right: { pressed: false },
  });

  public readonly stateExposed = computed(() => this.state());

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    const code = KEY_MAP[key];

    if (!code) {
      return;
    }

    if (!this.state()[code]) {
      return;
    }

    this.state.update((st) => ({
      ...st,
      [code]: { pressed: true },
    }));
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key;

    const code = KEY_MAP[key];

    if (!code) {
      return;
    }

    if (!this.state()[code]) {
      return;
    }

    this.state.update((st) => ({
      ...st,
      [code]: { pressed: false },
    }));
  }
}
