import { Request, Response } from "express";
import { Recruitment } from "../../models/Recruitment";
import { recruitmentValidationSchema } from "./recruitment.schema";

export const createRecruitment = async (req: Request, res: Response) => {
  try {
    const validatedData = recruitmentValidationSchema.parse(req.body);

    const newRecruitment = await Recruitment.create(validatedData);

    return res.status(201).json({ success: true, data: newRecruitment });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid data", error });
  }
};

export const getRecruitment = async (req: Request, res: Response) => {
  try {
    const recruitments = await Recruitment.find();
    return res.status(200).json({ success: true, data: recruitments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getRecruitmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const recruitment = await Recruitment.findById(id);
    if (!recruitment) {
      return res.status(404).json({ success: false, message: "Recruitment not found" });
    }
    return res.status(200).json({ success: true, data: recruitment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateRecruitment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedRecruitment = await Recruitment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRecruitment) {
      return res.status(404).json({ success: false, message: "Recruitment not found" });
    }
    return res.status(200).json({ success: true, data: updatedRecruitment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteRecruitment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedRecruitment = await Recruitment.findByIdAndDelete(id);
    if (!deletedRecruitment) {
      return res.status(404).json({ success: false, message: "Recruitment not found" });
    }
    return res.status(200).json({ success: true, message: "Recruitment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
