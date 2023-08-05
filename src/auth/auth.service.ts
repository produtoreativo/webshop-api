import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  authenticateMagentoAPI = async function () {
    const baseUrl = 'http://localhost:8080';
    const username = 'cmilfont@gmail.com';
    const password = 'testes147/258*369';

    try {
      const apiURL = `${baseUrl}/V1/integration/customer/token`;
      const params = { username, password };
      const response = await this.httpService.axiosRef.post(apiURL, params);

      if (response.status === 200) {
        const accessToken = response.data;
        console.log('Token de acesso:', accessToken);
        return accessToken;
      } else {
        console.error('Falha na autenticação');
        return null;
      }
    } catch (error) {
      console.error('Erro:', error.message);
    }
  };
}
