// backend/src/tests/setup.js
import { TextService } from '../core/typing/TextService';
import { MetricsService } from '../core/metrics/MetricsService';
import { EventEmitter } from 'events';

global.TextService = TextService;
global.MetricsService = MetricsService;
global.EventEmitter = EventEmitter;