import { Order } from '../../domain/entities/order'
import { OrderRepository } from '../../domain/ports/order-repository'

export class PrismaOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    void order
  }
}
