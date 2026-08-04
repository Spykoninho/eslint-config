import { Order } from '../../domain/entities/order'
import { OrderRepository } from '../../domain/ports/order-repository'

export class CreateOrder {
  constructor(private readonly orders: OrderRepository) {}

  async execute(id: string): Promise<void> {
    await this.orders.save(new Order(id))
  }
}
