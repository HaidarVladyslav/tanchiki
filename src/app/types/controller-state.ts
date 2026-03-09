// export type KeyCode = 'right' | 'left' | 'up' | 'down';

import { Direction } from './direction';

export type ControllerState = { [key in Direction]: { pressed: boolean } };
