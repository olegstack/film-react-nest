import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('.log() должен выводить JSON-строку в console.log', () => {
    const mock = jest.spyOn(console, 'log').mockImplementation(() => {});
    const message = 'test log';
    logger.log(message);

    const expected = JSON.stringify({
      level: 'log',
      message,
      optionalParams: [],
    });
    expect(mock).toHaveBeenCalledWith(expected);
  });

  it('.error() должен выводить JSON-строку в console.error', () => {
    const mock = jest.spyOn(console, 'error').mockImplementation(() => {});
    const message = 'test error';
    logger.error(message);

    const expected = JSON.stringify({
      level: 'error',
      message,
      optionalParams: [],
    });
    expect(mock).toHaveBeenCalledWith(expected);
  });

  it('.warn() должен выводить JSON-строку в console.warn', () => {
    const mock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const message = 'test warn';
    logger.warn(message);

    const expected = JSON.stringify({
      level: 'warn',
      message,
      optionalParams: [],
    });
    expect(mock).toHaveBeenCalledWith(expected);
  });
});
