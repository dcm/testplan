// @ts-nocheck

const defaultArgs = {
  rexp: /heyy/,
  srcStream: 'error',
  dstStream: 'debug',
  notifyInterval: 15000,
  unrevertInterval: 5000,
  logger: global.console,
  revertOnError: true,
};

const noop = () => {};

describe('calmLogger', () => {

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global.console, defaultArgs.srcStream)
      .mockImplementation(noop)
      .mockName(`global.console.${defaultArgs.srcStream}`);
    jest.spyOn(global.console, defaultArgs.dstStream)
      .mockImplementation(noop)
      .mockName(`global.console.${defaultArgs.dstStream}`);
    global.env = {
      calmedLogger: require('../calmLogger').default(defaultArgs),
    };
  });

  it('functions are called as expected', () => {
    expect(global.env.calmedLogger).toBe(global.console);
    expect(global.console).toHaveProperty('_');
    expect(global.console._).toHaveProperty('src');
    expect(global.console._).toHaveProperty('dst');
    expect(global.console._).toHaveProperty('store');
    expect(global.console._).toHaveProperty('undo');

    jest.spyOn(global.console._, 'src')
      .mockImplementation(noop)
      .mockName('global.console._.src');
    jest.spyOn(global.console._, 'dst')
      .mockImplementation(noop)
      .mockName('global.console._.dst');
    jest.spyOn(global.console._.store, 'set')
      .mockImplementation(noop)
      .mockName('global.console._.store.set');
    jest.spyOn(global.console._.store, 'clear')
      .mockImplementation(noop)
      .mockName('global.console._.store.clear');

    global.console.error('error1');
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);
    expect(global.console._.store.set).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(5000);
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);
    expect(global.console._.store.set).toHaveBeenCalledTimes(0);

    global.console.error('error2 heyy');
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);
    expect(global.console._.store.set).toHaveBeenCalledTimes(1);

    global.console.error('heyy clash1');
    global.console._.store.locked = true;
    global.console.error('heyy clash2');

    jest.advanceTimersByTime(1);
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);
    expect(global.console._.store.set).toHaveBeenCalledTimes(2);

    global.console._.store.locked = false;
    jest.advanceTimersByTime(5000);
    expect(global.console._.store.set).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(4999);
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);
    expect(global.console._.store.set).toHaveBeenCalledTimes(3);

    global.console.error('error3');
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(2);
    expect(global.console._.store.set).toHaveBeenCalledTimes(3);
  });

  it('entries are stored and dumped at the right time', () => {
    jest.spyOn(global.console._, 'src')
      .mockImplementation(noop)
      .mockName('global.console._.src');
    jest.spyOn(global.console._, 'dst')
      .mockImplementation(noop)
      .mockName('global.console._.dst');

    global.console.error('error1');
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);

    global.console.error('error2 heyy');
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);

    global.console.error('heyy clash1');
    global.console._.store.locked = true;
    global.console.error('heyy clash2');

    jest.advanceTimersByTime(1);
    expect(global.console._.dst).toHaveBeenCalledTimes(0);
    expect(global.console._.src).toHaveBeenCalledTimes(1);

    global.console._.store.locked = false;
    jest.advanceTimersByTime(5000);

    jest.advanceTimersByTime(4999);
    expect(global.console._.dst).toHaveBeenCalledTimes(3);
    expect(global.console._.src).toHaveBeenCalledTimes(1);

    global.console.error('error3');
    expect(global.console._.dst).toHaveBeenCalledTimes(3);
    expect(global.console._.src).toHaveBeenCalledTimes(2);
  });

  it('we can undo()', () => {
    expect(global.console).toHaveProperty('_');
    const prevSrcName = global.console._.src.getMockName();
    global.console._.undo();
    // this shows the hidden attr '_' was removed
    expect(global.console).not.toHaveProperty('_');
    // this shows '_.src' was reassigned to its actual stream
    expect(global.console[defaultArgs.srcStream].getMockName())
      .toBe(prevSrcName);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

});
