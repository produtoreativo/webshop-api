import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async listAll() {
    const SEARCH_API_URL = this.configService.get('SEARCH_API_URL');
    return this.httpService.axiosRef.get(SEARCH_API_URL) || [];
  }
}
