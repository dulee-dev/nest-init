import * as crypto from 'crypto';
import { ValueTransformer } from 'typeorm';

// 랜덤한 Salt용 문자열 반환
export const getSalt = (): string => {
  return crypto.randomBytes(20).toString('base64');
};

// 비밀번호 암호화
export const pwEncrypt = (pw: string, salt: string): string => {
  return crypto.pbkdf2Sync(pw, salt, 10000, 64, 'sha512').toString('base64');
};

// 랜덤한 문자열 반환
export const getRandStr = (length = 6): string => {
  return crypto.randomBytes(length).toString('base64');
};

export interface LatLongPoint {
  lat: number;
  lon: number;
}

export class PointTransformer implements ValueTransformer {
  to(value: LatLongPoint) {
    const { lat, lon } = value;
    return `POINT(${lon} ${lat})`;
  }

  from(value): LatLongPoint {
    const [lon, lat] = value.replace(/POINT|\(|\)/g, '').split(' ');
    return { lat: Number(lat), lon: Number(lon) };
  }
}

export const getDateString = (): string => {
  const dt = new Date();

  return `${dt.getFullYear()}${dt.getMonth() + 1}${dt.getDate()}`;
};
