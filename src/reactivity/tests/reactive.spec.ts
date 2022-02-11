import { isReactive, reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observered = reactive(original);
    expect(original).not.toBe(observered);
    expect(observered.foo).toBe(1);
    expect(isReactive(observered)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });
});
