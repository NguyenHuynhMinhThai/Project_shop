import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ProductService } from '../../products/services/product.service';

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
    const order = this.orderRepository.create({
      status: 'PENDING',
      totalAmount: 0,
    });

    const savedOrder = await this.orderRepository.save(order);
    let totalAmount = 0;
    let totalTax = 0;

    for (const item of createOrderDto.items) {
      const product = await this.productService.findOne(item.productId);
      
      if (product.quantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const baseTax = 10;
      const specialTax = product.isSpecialTax ? product.specialTax : 0;
      const taxRate = (baseTax + specialTax) / 100;
      const tax = product.price * taxRate * item.quantity;

      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
        product,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity + tax,
      });

      await this.orderItemRepository.save(orderItem);
      await this.productService.updateStock(product.id, -item.quantity);
      
      totalAmount += orderItem.subtotal;
      totalTax += tax;
    }

    savedOrder.totalAmount = totalAmount;
    // @ts-ignore
    savedOrder.totalTax = totalTax;
    return this.orderRepository.save(savedOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
} 