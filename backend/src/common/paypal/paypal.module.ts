import Module from "module";
import { PaypalService } from "./paypal.service";

@Module({
  providers: [PaypalService],
})
export class PaypalModule {}


