import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExists) {
      console.log("Super admin exists");
      return;
    }
    console.log("...trying to create super admin");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };
    const payload: IUser = {
      name: envVars.SUPER_ADMIN_NAME,
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      phone: envVars.SUPER_ADMIN_PHONE,
      address: {
        division: envVars.SUPER_ADMIN_DIVISION,
        city: envVars.SUPER_ADMIN_CITY,
        zip: Number(envVars.SUPER_ADMIN_ZIP),
        street: envVars.SUPER_ADMIN_CITY,
      },
      isVerified: true,
      auths: [authProvider],
    };
    const superAdmin = await User.create(payload);
    console.log("Super admin created successfully!");
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
