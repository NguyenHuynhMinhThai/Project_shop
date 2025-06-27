import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { ProductService } from '../../products/services/product.service';
import { Product } from '../../products/entities/product.entity';

export async function implementCreateOrder(
  createOrderDto: CreateOrderDto,
  orderRepository: Repository<Order>,
  orderItemRepository: Repository<OrderItem>,
  productService: ProductService,
): Promise<Order> {
  const order = orderRepository.create({
    status: 'PENDING',
    totalAmount: 0,
  });

  const savedOrder = await orderRepository.save(order);
  let totalAmount = 0;
  let totalTax = 0;

  for (const item of createOrderDto.items) {
    const product = await productService['productRepository'].findOne({ where: { id: item.productId } });
    if (!product) {
      throw new BadRequestException(`Product with ID ${item.productId} not found`);
    }
    if (product.quantity < item.quantity) {
      throw new BadRequestException(`Insufficient stock for product ${product.name}`);
    }
    const baseTax = 10;
    const specialTax = product.isSpecialTax ? Number(product.specialTax) : 0;
    const taxRate = (baseTax + specialTax) / 100;
    const price = Number(product.price);
    const basePrice = price * item.quantity;
    const tax = basePrice * taxRate;
    const subtotal = basePrice + tax;
    const orderItem = orderItemRepository.create({
      order: savedOrder,
      product,
      quantity: item.quantity,
      price: price,
      subtotal: subtotal,
    });
    await orderItemRepository.save(orderItem);
    product.quantity -= item.quantity;
    await productService['productRepository'].save(product);
    totalAmount += orderItem.subtotal;
    totalTax += tax;
  }
  savedOrder.totalAmount = totalAmount;
  // @ts-ignore
  savedOrder.totalTax = totalTax;
  return orderRepository.save(savedOrder);
}

export async function implementFindAllOrders(
  orderRepository: Repository<Order>,
): Promise<Order[]> {
  return orderRepository.find({ relations: ['orderItems', 'orderItems.product'] });
}

export async function implementFindOneOrder(
  id: number,
  orderRepository: Repository<Order>,
): Promise<Order> {
  const order = await orderRepository.findOne({ where: { id }, relations: ['orderItems', 'orderItems.product'] });
  if (!order) {
    throw new NotFoundException(`Order with ID ${id} not found`);
  }
  return order;
}

export async function implementUpdateOrder(
  id: number,
  updateOrderDto: UpdateOrderDto,
  orderRepository: Repository<Order>,
): Promise<Order> {
  const order = await orderRepository.findOne({ where: { id } });
  if (!order) {
    throw new NotFoundException(`Order with ID ${id} not found`);
  }
  Object.assign(order, updateOrderDto);
  return orderRepository.save(order);
}

export async function implementRemoveOrder(
  id: number,
  orderRepository: Repository<Order>,
): Promise<void> {
  const order = await orderRepository.findOne({ where: { id } });
  if (!order) {
    throw new NotFoundException(`Order with ID ${id} not found`);
  }
  await orderRepository.remove(order);
} 