import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { ProductService } from '../../products/services/product.service';
import {
  implementCreateOrder,
  implementFindAllOrders,
  implementFindOneOrder,
  implementUpdateOrder,
  implementRemoveOrder,
} from '../implement/order.implement';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productService: ProductService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return implementCreateOrder(
      createOrderDto,
      this.orderRepository,
      this.orderItemRepository,
      this.productService,
    );
  }

  async findAll(): Promise<Order[]> {
    return implementFindAllOrders(this.orderRepository);
  }

  async findOne(id: number): Promise<Order> {
    return implementFindOneOrder(id, this.orderRepository);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return implementUpdateOrder(id, updateOrderDto, this.orderRepository);
  }

  async remove(id: number): Promise<void> {
    return implementRemoveOrder(id, this.orderRepository, this.orderItemRepository);
  }
} 