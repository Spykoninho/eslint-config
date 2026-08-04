import { Order } from '../../domain/entities/order'
import { OrderRepository } from '../../domain/ports/order-repository'

export class ArchiveOrder {
  constructor(private readonly orders: OrderRepository) {}

  execute(id: string): void {
    this.orders.save(new Order(id))
  }
}
