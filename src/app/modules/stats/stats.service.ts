import { Status } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getParcelStats = async () => {
  const totalParcelsPromise = Parcel.countDocuments({});
  const totalParcelCreatedInLast7DaysPromise = Parcel.countDocuments({
    createdAt: {
      $gte: sevenDaysAgo,
    },
  });
  const totalParcelCreatedInLast30DaysPromise = Parcel.countDocuments({
    createdAt: {
      $gte: thirtyDaysAgo,
    },
  });
  const totalDeliveredParcelsPromise = Parcel.countDocuments({
    currentStatus: Status.DELIVERED,
  });
  const totalCancelledParcelsPromise = Parcel.countDocuments({
    currentStatus: Status.CANCELLED,
  });
  const totalReturnedParcelsPromise = Parcel.countDocuments({
    currentStatus: Status.RETURNED,
  });
  const totalApprovedParcelsPromise = Parcel.countDocuments({
    currentStatus: Status.APPROVED,
  });
  const totalParcelDeliveredInLast30DaysPromise = Parcel.countDocuments({
    deliveryDate: {
      $get: thirtyDaysAgo,
    },
  });
  const [
    totalParcels,
    totalParcelCreatedInLast7Days,
    totalParcelCreatedInLast30Days,
    totalDeliveredParcels,
    totalCancelledParcels,
    totalReturnedParcels,
    totalApprovedParcels,
    totalParcelDeliveredInLast30Days,
  ] = await Promise.all([
    totalParcelsPromise,
    totalParcelCreatedInLast7DaysPromise,
    totalParcelCreatedInLast30DaysPromise,
    totalDeliveredParcelsPromise,
    totalCancelledParcelsPromise,
    totalReturnedParcelsPromise,
    totalApprovedParcelsPromise,
    totalParcelDeliveredInLast30DaysPromise,
  ]);
  return {
    totalParcels,
    totalParcelCreatedInLast7Days,
    totalParcelCreatedInLast30Days,
    totalDeliveredParcels,
    totalCancelledParcels,
    totalReturnedParcels,
    totalApprovedParcels,
    totalParcelDeliveredInLast30Days,
  };
};

const getUserStats = async () => {
  const totalUserPromise = User.countDocuments({});
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInactiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: {
      $gte: sevenDaysAgo,
    },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: {
      $gte: thirtyDaysAgo,
    },
  });

  const usersByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalBlockedUsers,
    totalInactiveUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  ] = await Promise.all([
    totalUserPromise,
    totalActiveUsersPromise,
    totalInactiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise,
  ]);
  return {
    totalUsers,
    totalActiveUsers,
    totalBlockedUsers,
    totalInactiveUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  };
};
export const StatsService = {
  getParcelStats,
  getUserStats,
};
