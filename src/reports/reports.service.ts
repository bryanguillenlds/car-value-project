import { GetEstimateDto } from './dtos/get-estimate.dto';
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

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price') //select the average price in the price column
      .where('make = :make', { make }) //filters
      .andWhere('model = :model', { model }) //additional filters
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng }) //additional filters
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat }) //additional filters
      .andWhere('year - :year BETWEEN -3 AND 3', { year }) //additional filters
      .andWhere('approved IS TRUE') //test boolean
      .orderBy('ABS(mileage - :mileage)', 'DESC') //order by mileage in desc order
      .setParameters({ mileage }) //set the mileage param in this special way
      .limit(3)
      .getRawOne();
  }
}
