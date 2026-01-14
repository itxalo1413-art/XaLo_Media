import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Inquiry } from "../../models/Inquiry";
import { Service } from "../../models/Service";
import { Article } from "../../models/Article";
import { ok } from "../../utils/response";

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    // 1. Inquiry Stats
    inquiriesNew,
    inquiriesTotal,
    
    // 2. Service Stats
    servicesTotal,
    
    // 3. Article Stats
    articlesTotal,
    articlesViews,
    
    // 4. Recent Inquiries
    recentInquiries
  ] = await Promise.all([
    // Counts
    Inquiry.countDocuments({ status: "new", isDeleted: false }),
    Inquiry.countDocuments({ isDeleted: false }),
    Service.countDocuments({ isDeleted: false }),
    Article.countDocuments({ isDeleted: false }),
    Article.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, totalViews: { $sum: "$viewCount" } } }
    ]),
    
    // Recent list
    Inquiry.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName interestedServices createdAt status")
      .lean()
  ]);

  const totalViews = articlesViews[0]?.totalViews || 0;

  return ok(res, {
    stats: {
      inquiriesNew,
      inquiriesTotal,
      servicesTotal,
      articlesTotal,
      articlesViews: totalViews
    },
    recentInquiries
  });
});
