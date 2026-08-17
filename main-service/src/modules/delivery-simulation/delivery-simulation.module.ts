import { Module } from '@nestjs/common';
import { OrderModule } from '@/modules/order/order.module';
import { DeliverySimulationService } from '@/modules/delivery-simulation/application/services/delivery-simulation.service';
import { DeliverySimulationController } from '@/modules/delivery-simulation/presentation/controllers/delivery-simulation.controller';

@Module({
  imports: [OrderModule],
  controllers: [DeliverySimulationController],
  providers: [DeliverySimulationService],
})
export class DeliverySimulationModule {}
