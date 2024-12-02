// backend/src/tests/unit/TextService.test.js
describe('TextService', () => {
    let textService;
    let eventEmitter;

    beforeEach(() => {
        eventEmitter = new EventEmitter();
        textService = new TextService(eventEmitter);
    });

    test('generates session with valid parameters', () => {
        const session = textService.generateSession({ wordCount: 50 });
        expect(session).toHaveProperty('id');
        expect(session).toHaveProperty('text');
        expect(session.text.split(' ').length).toBe(50);
    });

    test('analyzes input correctly', () => {
        const session = textService.generateSession({ wordCount: 10 });
        const analysis = textService.analyzeInput(session.id, 'test input');
        expect(analysis).toHaveProperty('type');
        expect(analysis).toHaveProperty('timestamp');
    });
});