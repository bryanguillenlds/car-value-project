import { User } from './../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);

    //relate the user to the report
    report.user = user;

    return this.repo.save(report);
  }
}
