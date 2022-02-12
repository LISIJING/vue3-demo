import { isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  test('should not mask nested propertites reactive', () => {
    //{foo:1}对象不应该是readonly的
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  });
  it('warn when call set', () => {
    console.warn = jest.fn();
    const user = shallowReadonly({ age: 10 });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });
});
