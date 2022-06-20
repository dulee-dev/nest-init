import { getRandStr } from 'src/libs/util';
import { getSalt, pwEncrypt } from 'src/libs/util';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { User } from './entity/user.entity';
import { PwCode } from './entity/pw-code.entity';
import * as bcrypt from 'bcrypt';
import { RetMsg } from 'src/types/shared';
import { MailerService } from '@nestjs-modules/mailer';

const MAX_SEC = 180;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(PwCode)
    private readonly pwCodesRepository: Repository<PwCode>,

    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
  ) {}

  // 네아로 토큰 검증
  private static async chckNaverToken(token: string): Promise<string> {
    const { status, data }: any = await axios.get(
      'https://openapi.naver.com/v1/nid/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_SECRET,
        },
      },
    );

    if (status === HttpStatus.OK) {
      return data.response.email;
    } else {
      throw new HttpException(
        '소셜 로그인에 실패하였습니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // 아이디 중복 체크
  async idDupChck(userId: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({ where: { userId } }));
  }

  // 닉네임 중복 체크
  async nickNameDupChck(userNickName: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({
      where: { userNickName: userNickName },
    }));
  }

  // 유저 생성
  async addUser(createUserDto: CreateUserDto) {
    if (createUserDto.authType && createUserDto.authType > 1) {
      try {
        const newUser = await this.userRepository.create(createUserDto);
        if (!newUser)
          throw new HttpException('객체 생실패', HttpStatus.BAD_REQUEST);
        const saveUser = await this.userRepository.save(newUser);
        return saveUser;
      } catch (err) {
        throw err;
      }
    } else {
      const user = new User();

      const { userId } = createUserDto;

      user.userId = userId;

      if (createUserDto.naverToken) {
        const naverEmail = await UserService.chckNaverToken(
          createUserDto.naverToken,
        );

        if (naverEmail === userId) user.isNaverLinked = true;
        else
          throw new HttpException(
            '소셜 회원가입에 실패하였습니다.',
            HttpStatus.BAD_REQUEST,
          );
      } else {
        const { userPw } = createUserDto;

        if (userPw.length >= 8) {
          const salt = getSalt();
          user.userPw = pwEncrypt(userPw, salt);
          user.userSalt = salt;
        } else {
          throw new HttpException(
            '비밀번호 길이가 너무 짧습니다.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const { userNickName, ph, addr1, addr2 } = createUserDto;

      user.userNickName = userNickName;
      user.ph = ph;
      user.addr1 = addr1;
      user.addr2 = addr2;

      await this.userRepository.save(user);
    }
  }

  async updateUser(user, updateUserDto) {
    const updateUser = await this.userRepository.update(
      user.userIdx,
      updateUserDto,
    );
    return updateUser;
  }

  // 로그인 처리
  async signIn(signInUserDto: SignInUserDto): Promise<string> {
    const { userId, userPw, naverToken } = signInUserDto;
    if (signInUserDto.authType) {
      try {
        const existUser = await this.userRepository.findOne({
          where: { ...signInUserDto },
        });
        return this.authService.signIn(
          existUser.userIdx,
          existUser.userId,
          existUser.userPwVersion,
        );
      } catch (err) {
        throw new HttpException(
          '소셜 로그인 연동을 진행해주세요.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (naverToken) {
      const userId = await UserService.chckNaverToken(naverToken);
      const user = await this.userRepository.findOne({
        select: ['userIdx', 'isNaverLinked', 'userPwVersion'],
        where: { userId },
      });

      if (user) {
        if (user.isNaverLinked)
          return this.authService.signIn(
            user.userIdx,
            userId,
            user.userPwVersion,
          );
        else
          throw new HttpException(
            '소셜 로그인 연동을 진행해주세요.',
            HttpStatus.BAD_REQUEST,
          );
      } else {
        throw new HttpException(RetMsg.NOT_EXISTS_DATA, HttpStatus.NOT_FOUND);
      }
    } else {
      const user = await this.userRepository.findOne({
        select: ['userIdx', 'userPw', 'userSalt', 'userPwVersion'],
        where: { userId },
      });

      if (user) {
        const { userIdx, userPw: userPwHash, userSalt, userPwVersion } = user;

        if (userSalt) {
          if (pwEncrypt(userPw, userSalt) === userPwHash) {
            return this.authService.signIn(userIdx, userId, userPwVersion);
          } else {
            throw new HttpException(RetMsg.WRONG_PW, HttpStatus.FORBIDDEN);
          }
        } else {
          throw new HttpException(
            '비밀번호가 등록되지 않은 계정입니다. 소셜 로그인을 진행해주세요.',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(RetMsg.NOT_EXISTS_DATA, HttpStatus.NOT_FOUND);
      }
    }
  }

  async findPw(userId: string) {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (user) {
      const { userIdx } = user;
      let { userSalt } = user;

      if (!userSalt) userSalt = getSalt();

      const newPw = getRandStr();

      const newPwHash = pwEncrypt(newPw, userSalt);

      await this.userRepository.update(userIdx, {
        userPw: newPwHash,
        userSalt,
        userPwVersion: () => 'user_pw_version + 1',
      });

      const mailerOption = {
        from: process.env.MAILER_SENDER,
        to: userId,
        subject: '[오든] 임시 비밀번호 발급',
        html: `
                  <h1>
                    임시 비밀번호 발급
                  </h1>
                  <hr />
                  <br />
                  <p>다음 비밀번호를 통해 로그인 해주세요<p/>
                  <p>임시 비밀번호: ${newPw}<p/>
                  <a href="https://oden.kr/sign-in">로그인하러 가기</a>
                  <br />
                  <hr />
                `,
      };
      try {
        await this.mailerService.sendMail(mailerOption);
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new HttpException(
        '등록 되지 않은 아이디입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 유저 상세 정보 조회
  async getUserInfo(userIdx: number) {
    return await this.userRepository.findOne({
      where: { userIdx },
      select: {
        userNickName: true,
        isNaverLinked: true,
      },
    });
  }

  // 유저 수정
  async modifyUser(userIdx: number, userNickName: string) {
    await this.userRepository.update(userIdx, { userNickName });
  }

  // 비밀번호 수정
  async modifyPw(userIdx: number, userId: string, pw: string) {
    const user = await this.userRepository.findOne({ where: { userIdx } });

    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    } else {
      let { userSalt } = user;

      if (!userSalt) userSalt = getSalt();

      const newPwHash = pwEncrypt(pw, userSalt);

      await this.userRepository
        .createQueryBuilder('u')
        .update()
        .whereInIds(userIdx)
        .set({
          userPw: newPwHash,
          userSalt,
          userPwVersion: () => 'user_pw_version + 1',
        })
        .execute();

      return await this.signIn({ userId, userPw: pw });
    }
  }

  // 기존 계정 네아로 연동 처리
  async connectNaverSignIn(userIdx: number, token: string) {
    const { userId: email1 } = await this.userRepository.findOneOrFail({
      where: { userIdx },
    });
    const email2 = await UserService.chckNaverToken(token);

    if (email1 === email2) {
      await this.userRepository.update(userIdx, { isNaverLinked: true });
    } else {
      throw new HttpException(
        '소셜 로그인 연동에 실패하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserNickName(userIdx) {
    return (
      await this.userRepository.findOne({
        where: { userIdx },
        select: ['userNickName'],
      })
    ).userNickName;
  }

  // user
  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto['userPw']) {
      if (updateUserDto.userPw.length < 8) {
        throw new HttpException(
          '비밀번호 길이가 너무 짧습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.userRepository.findOne({
        where: { userIdx: id },
      });
      updateUserDto['userPw'] = pwEncrypt(
        updateUserDto['userPw'],
        user['userSalt'],
      );
    }
    const ret = await this.userRepository.update(id, updateUserDto);
    if (!ret.affected)
      throw new HttpException('잘못된 접근입니다.', HttpStatus.NOT_ACCEPTABLE);
    return ret;
  }

  async findEmailTrue(userEmail: string) {
    try {
      const existUser = await this.userRepository.findOneOrFail({ where: { userId: userEmail }});
      if (existUser) {
        if (!existUser.userPw) {
          return 'social';
        } else {
          return existUser?.userId;
        }
      }
    } catch (error) {
      throw new HttpException(
        '등록된 이메일 주소가 아닙니다',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async pwCodeVali(userEmail: string) {
    try {
      const userExist = await this.userRepository.findOne({where: {
        userId: userEmail,
      }});
      if (!userExist)
        throw new HttpException('조회 실패', HttpStatus.BAD_REQUEST);
      const code = Math.floor(Math.random() * 899999 + 100000);
      const hash = await bcrypt.hash(userExist.userIdx.toString(), 10);
      const newPwCode = await this.pwCodesRepository.create({
        pwCodeUserId: userExist.userIdx,
        hash,
        code,
      });
      const mailerOption = {
        from: process.env.MAILER_SENDER,
        to: userExist.userId,
        subject: '[오든] 비밀번호 초기화',
        html: `
                  <h1>
                    비밀번호 초기화 코드
                  </h1>
                  <hr />
                  <br />
                  <h3>인증코드 6자리<p/>
                  <h2>${code}<p/>
                  <a href='https://oden.kr/pw/reset?resetToken=${hash}'>코드 입력 페이지</a>
                  <br />
                  <hr />
                `,
      };
      this.mailerService.sendMail(mailerOption);
      if (!newPwCode)
        throw new HttpException('객체 생성 실패', HttpStatus.BAD_REQUEST);
      const savePwCode = await this.pwCodesRepository.save(newPwCode);
      if (!savePwCode)
        throw new HttpException('저장 실패', HttpStatus.BAD_REQUEST);
      setTimeout(
        () => this.pwCodesRepository.remove(newPwCode),
        1000 * MAX_SEC,
      );
      return hash;
    } catch (error) {
      throw error;
    }
  }

  async pwCodeVerif(resetToken: string, newCode: number) {
    try {
      const findOption = { hash: resetToken, code: newCode };
      const pwCodeExist = await this.pwCodesRepository.findOne({where: {...findOption}});
      if (!pwCodeExist)
        throw new HttpException('조회 실패', HttpStatus.BAD_REQUEST);
      return {};
    } catch (error) {
      throw error;
    }
  }

  async findExistEmail(userEmail: string): Promise<number> {
    const userEmailExist = await this.userRepository.findOne({where: {
      userId: userEmail,
    }});
    if (!userEmailExist) return -1;
    else return userEmailExist.authType;
  }

  // 유저 상세 정보 조회
  async findMe(userIdx: number) {
    return await this.userRepository.findOne({where: {userIdx},
    select: {
      userNickName: true,
      ph: true,
      addr1: true,
      addr2: true
    }});
  }
  // 닉네임 중복 체크
  async checkMyNickDup(
    userIdx: number,
    userNickName: string,
  ): Promise<boolean> {
    const userExist = await this.userRepository.findOne({where: { userNickName }});
    if (userExist && userExist.userIdx !== userIdx) return true;
    else return false;
  }

  async removeMe(userIdx: number) {
    const existUser = await this.userRepository.findOne({where: {userIdx}});
    const removeUser = await this.userRepository.remove(existUser);
    return removeUser;
  }
}
