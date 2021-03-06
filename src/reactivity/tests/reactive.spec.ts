import { isProxy, isReactive, reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observered = reactive(original);
    expect(original).not.toBe(observered);
    expect(observered.foo).toBe(1);
    expect(isReactive(observered)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(observered)).toBe(true);
  });

  it('nested reactive', () => {
    const original = { nested: { foo: 1 }, array: [{ bar: 2 }] };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});
