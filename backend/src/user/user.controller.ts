import { Body, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HasRole } from 'src/helper/decorator/roles.decorator';
import { Role } from 'src/helper/enum/role.enum';
import { JwtAuthGuard } from 'src/helper/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/helper/guard/local-ath.guard';
import { UserService } from './user.service';
import { FindUserById, GetAllUsersDto } from './user.dto';

@Controller('v2/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(LocalAuthGuard)
  @UseGuards(JwtAuthGuard)
  @HasRole(Role.ADMIN)
  async getAllUsers(
    @Param() params: GetAllUsersDto,
    @Query() query: GetAllUsersDto,
  ) {
    const page: number = params.page ?? query.page ?? 1;
    const limit: number = params.limit ?? query.limit ?? 10;
    return this.userService.getAllUsers(limit, page);
  }

  @Get()
  @UseGuards(LocalAuthGuard)
  @UseGuards(JwtAuthGuard)
  @HasRole(Role.ADMIN)
  async findUserById(
    @Param() idParam: FindUserById,
    @Query() idQuery: FindUserById,
  ) {
    const id: number = idParam.id ?? idQuery.id;
    return this.userService.findUserById(id);
  }

  async findUserByName();
}
