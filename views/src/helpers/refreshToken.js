import noty from '../helpers/noty';
import got from './got';

export default function refreshToken() {
  return got('/user/refresh-tokens', 'post')
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.message);
      }

      return response.json();
    })
    .then(({ status, accessToken }) => {
      console.log(status, accessToken);
      if (!status) {
        throw new Error('Undefined error...');
      }

      sessionStorage.setItem('needRefreshToken', 0);
      localStorage.setItem('accessToken', accessToken);
    })
    .catch((error) => {
      console.error(error);
      sessionStorage.setItem('needRefreshToken', 2);
      noty(`Ошибка обновления токена безопасности (${error.message})`, 'error');
    })  }
