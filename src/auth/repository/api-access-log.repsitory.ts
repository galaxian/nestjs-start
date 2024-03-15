import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ApiAccessLog } from '../entity/api-access-log.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class ApiAccessLogRepository extends Repository<ApiAccessLog> {
  constructor(
    @InjectRepository(ApiAccessLog)
    private readonly apiAccessRepository: Repository<ApiAccessLog>,
    @InjectEntityManager()
    private readonly entityManage: EntityManager,
  ) {
    super(
      apiAccessRepository.target,
      apiAccessRepository.manager,
      apiAccessRepository.queryRunner,
    );
  }

  async creaetAccessLog(
    user: User,
    userAgent: string,
    endpoint: string,
    ip: string,
  ) {
    const apiAccessLog = new ApiAccessLog();
    apiAccessLog.userAgent = userAgent;
    apiAccessLog.ip = ip;
    apiAccessLog.endpoint = endpoint;
    apiAccessLog.user = user;
    apiAccessLog.accessedAt = new Date();
    await this.save(apiAccessLog);
  }
}
