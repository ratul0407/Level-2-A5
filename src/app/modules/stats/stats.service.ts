import { Status } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
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
  //   const parcelsCreatedOverTheLast30Days = Parcel.aggregate([
  //     {
  //       $match: {
  //         createdAt: {$gte: thirtyDaysAgo },
  //       },
  //       {
  //         $group: {
  //             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt"}},
  //             count: {$sum: 1}
  //         }
  //       }
  //     },
  //   ]);
  const parcelsCreatedOverTheLast30DaysPromise = Parcel.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  const [
    totalParcels,
    totalParcelCreatedInLast7Days,
    totalParcelCreatedInLast30Days,
    totalDeliveredParcels,
    totalCancelledParcels,
    totalReturnedParcels,
    totalApprovedParcels,
    totalParcelDeliveredInLast30Days,
    parcelsCreatedOverTheLast30Days,
  ] = await Promise.all([
    totalParcelsPromise,
    totalParcelCreatedInLast7DaysPromise,
    totalParcelCreatedInLast30DaysPromise,
    totalDeliveredParcelsPromise,
    totalCancelledParcelsPromise,
    totalReturnedParcelsPromise,
    totalApprovedParcelsPromise,
    totalParcelDeliveredInLast30DaysPromise,
    parcelsCreatedOverTheLast30DaysPromise,
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
    parcelsCreatedOverTheLast30Days,
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
  const usersCreatedOverTheLast30DaysPromise = User.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
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
    usersCreatedOverTheLast30Days,
  ] = await Promise.all([
    totalUserPromise,
    totalActiveUsersPromise,
    totalInactiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise,
    usersCreatedOverTheLast30DaysPromise,
  ]);
  return {
    totalUsers,
    totalActiveUsers,
    totalBlockedUsers,
    totalInactiveUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
    usersCreatedOverTheLast30Days,
  };
};
export const StatsService = {
  getParcelStats,
  getUserStats,
};
