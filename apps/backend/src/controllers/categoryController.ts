import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

export class CategoryController {
  // Get all categories
  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await Category.find()
        .populate('parent', 'name')
        .sort({ name: 1 });

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get single category
  public getCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const category = await Category.findById(id)
        .populate('parent', 'name');

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found',
        });
        return;
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create category
  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = new Category(req.body);
      await category.save();

      const populatedCategory = await Category.findById(category._id)
        .populate('parent', 'name');

      res.status(201).json({
        success: true,
        data: populatedCategory,
        message: 'Category created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Update category
  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const category = await Category.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('parent', 'name');

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found',
        });
        return;
      }

      res.json({
        success: true,
        data: category,
        message: 'Category updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete category
  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
