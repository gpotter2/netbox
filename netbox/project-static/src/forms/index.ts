import { initFormElements } from './elements';
import { initSpeedSelector } from './speedSelector';
import { initDeviceLayoutWidget } from './deviceLayoutWidget';

export function initForms(): void {
  for (const func of [initFormElements, initSpeedSelector, initDeviceLayoutWidget]) {
    func();
  }
}
