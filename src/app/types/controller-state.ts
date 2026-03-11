import { Action } from './action';

export type ControllerState = { [key in Action]: { pressed: boolean } };
