import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRequestDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  it('должен вызвать service.create() при создании заказа', async () => {
    const dto: OrderRequestDto = {
      email: 'test@example.com',
      phone: '+70000000000',
      tickets: [
        { film: 'Фильм 1', session: 'Сеанс 1', row: 3, seat: 7 },
        { film: 'Фильм 2', session: 'Сеанс 2', row: 2, seat: 4 },
      ],
    };

    const mockResponse = { total: 2, items: [] };
    mockService.create.mockResolvedValue(mockResponse);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResponse);
  });
});
