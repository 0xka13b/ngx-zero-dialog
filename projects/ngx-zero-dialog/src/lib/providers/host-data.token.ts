import { InjectionToken } from '@angular/core';
import { IHostData } from '../models/host-data.interface';

/**
 * Injection token for host component data.
 * Available in the host component to access data passed via `hostData` in the config.
 */
export const HOST_DATA = new InjectionToken<IHostData>('HOST_DATA');
