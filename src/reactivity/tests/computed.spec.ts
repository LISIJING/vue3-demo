import { computed } from '../computed';
import { reactive } from '../reactive';

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 });
    const age = computed(() => {
      return user.age;
    });

    expect(age.value).toBe(10);
  });

  it('should computed lazily', () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });

    const cValue = computed(getter);

    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);
    //依赖的值发生改变，并不会触发getter函数执行
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);
    //只有依赖的值发生改变后再次调用cValue.value，才会再次触发getter
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
