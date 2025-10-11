import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('.log() должен выводить строку в формате TSKV', () => {
    const mock = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('Hello', 'App');

    expect(mock).toHaveBeenCalledWith(
      expect.stringMatching(/^time=.*\tlevel=log\tmessage=Hello\tcontext=App$/),
    );
  });

  it('.error() должен выводить строку в формате TSKV', () => {
    const mock = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Oops', 'ErrorHandler');

    expect(mock).toHaveBeenCalledWith(
      expect.stringMatching(
        /^time=.*\tlevel=error\tmessage=Oops\tcontext=ErrorHandler$/,
      ),
    );
  });

  it('.warn() должен выводить строку в формате TSKV', () => {
    const mock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('Be careful', 'System');

    expect(mock).toHaveBeenCalledWith(
      expect.stringMatching(
        /^time=.*\tlevel=warn\tmessage=Be careful\tcontext=System$/,
      ),
    );
  });
});
