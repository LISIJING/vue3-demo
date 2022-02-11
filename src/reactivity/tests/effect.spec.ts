import { add } from '../index';
import { reactive } from '../reactive';
import { effect, stop } from '../effect';

describe('effect', () => {
  it('happy path', () => {
    let user = reactive({ age: 10 });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });
  it('should be return runner when call effect', () => {
    let foo = 10;
    // effect会返回一个runner函数，再次调用runner函数会再次执行effect里面的function
    let runner = effect(() => {
      foo++;
      return 'run';
    });

    expect(foo).toBe(11);
    let res = runner();
    expect(foo).toBe(12);
    expect(res).toBe('run');
  });

  it('scheduler', () => {
    let obj = reactive({ foo: 1 });
    let dummy;
    let run: any;
    let scheduler = jest.fn(() => {
      run = runner;
    });
    let runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler },
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

  it('stop', () => {
    let dummy;
    let obj = reactive({ foo: 1 });
    let runner = effect(() => {
      dummy = obj.foo;
    });
    expect(dummy).toBe(1);
    obj.foo = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.foo++;
    expect(dummy).toBe(2);
    runner();
    expect(dummy).toBe(3);
    obj.foo++;
    expect(dummy).toBe(3);
    expect(obj.foo).toBe(4);
  });

  it('onStop', () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop },
    );

    //当调用stop的时候，会执行用户传入的onStop回调方法
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
