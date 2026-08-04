import { Order } from '../entities/order'

export interface OrderRepository {
  save(order: Order): Promise<void>
}
