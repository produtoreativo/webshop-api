import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { catchError, map } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface AdminAccess {
  token: string;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  private adminAccess: AdminAccess;
  private readonly logger = new Logger(AuthService.name);
  private baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = configService.get('MAGENTO_URL');
  }
  async login(data: LoginDto) {
    const payload: AxiosRequestConfig = {
      url: this.baseUrl + '/rest/V1/integration/customer/token',
      method: 'POST',
      data,
    };
    return this.httpService
      .request(payload)
      .pipe(
        map((response) => {
          return {
            accessToken: response.data,
            createdAt: Date.now(),
            expireIn: '1h',
          };
        }),
      )
      .pipe(
        catchError((error) => {
          this.logger.error(error?.response?.data?.message);
          throw new BadRequestException('Error on login');
        }),
      );
  }
  async register(customerData: RegisterDto) {
    const { password, ...others } = customerData;
    const payload: AxiosRequestConfig = {
      url: this.baseUrl + '/rest/V1/customers',
      method: 'POST',
      data: { customer: others, password },
    };
    return this.httpService
      .request<{ id: number }>(payload)
      .pipe(map((response) => response.data))
      .pipe(
        catchError((error) => {
          this.logger.error(error?.response?.data?.message);
          throw new BadRequestException('Error on register');
        }),
      );
  }

  async getUser(token: string) {
    const requestParams: AxiosRequestConfig = {
      url: this.baseUrl + '/rest/V1/customers/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await this.httpService.axiosRef.request(requestParams);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Error on get user info',
        error?.response?.data?.message,
      );
    }
  }

  async getAdminAccessToken() {
    const MAGENTO_ADMIN_USERNAME = this.configService.get(
      'MAGENTO_ADMIN_USERNAME',
    );
    const MAGENTO_ADMIN_PASSWORD = this.configService.get(
      'MAGENTO_ADMIN_PASSWORD',
    );

    if (!this.adminAccess) {
      const payload: AxiosRequestConfig = {
        method: 'POST',
        url: this.baseUrl + '/rest/V1/integration/admin/token',
        data: {
          username: MAGENTO_ADMIN_USERNAME,
          password: MAGENTO_ADMIN_PASSWORD,
        },
      };
      this.adminAccess = {
        token: (await this.httpService.axiosRef.request(payload)).data,
        createdAt: new Date(),
      };
      return this.adminAccess.token;
    }

    const now = new Date();
    const diff = now.getTime() - this.adminAccess.createdAt.getTime();
    const FOUR_HOURS = 4 * 60 * 60 * 1000;

    if (diff >= FOUR_HOURS) {
      this.adminAccess = undefined;

      return this.getAdminAccessToken();
    }

    return this.adminAccess.token;
  }
}
