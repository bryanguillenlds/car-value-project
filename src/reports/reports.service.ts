import { User } from './../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async changeApproval(id: string, approved: boolean) {
    //find report
    const report = await this.repo.findOne(id);

    //if not found, throw
    if (!report) {
      throw new NotFoundException('Report Not Found');
    }

    //assign the value of approved
    report.approved = approved;

    //return/save report
    return this.repo.save(report);
  }
}
