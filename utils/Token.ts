import { IUserModel } from '@models/User';
import { generateJWT } from '@utils/JWT';

export const tokenBuilder = async (user: IUserModel) => {
    const accessToken = generateJWT(
      {
        id: user._id,
        role: user.role?.name,
        tokenType: 'access',
      },
      {
        issuer: user.email,
        subject: user.email,
        audience: 'root',
      },
    );
  
    return {
      accessToken: accessToken,
    };
  };