import { dbConection } from "../config/db.js";
import ProductMast from "../models/ProductMast.js";
import ProductPricing from "../models/ProductPricing.js";
import ProductContent from "../models/ProductContent..js"; // fixed double-dot typo

// CREATE / UPDATE Product
export const createOrUpdateProduct = async (req, res) => {
  const { flag, Master, price = [], content = [] } = req.body;
  const sequelize = await dbConection();
  const UserName = req.user?.UserName || "System";
  const IpAddress =
    req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "Not Found";

  const transaction = await sequelize.transaction();

  try {
    // --- Step 1: Delete old records if flag === "U" ---
    if (flag === "U") {
      await ProductMast.destroy({
        where: { ProductUkeyId: Master.ProductUkeyId }, transaction,
      });

      await ProductPricing.destroy({
        where: { ProductUkeyId: Master.ProductUkeyId }, transaction,
      });

      await ProductContent.destroy({
        where: { ProductUkeyId: Master.ProductUkeyId }, transaction,
      });
    }

    // --- Step 2: Insert into ProductMast ---
    await ProductMast.create(
      {
        ...Master,
        IpAddress,
        EntryDate: new Date().toJSON().toString(), // replaces GETDATE()
        UserName,
        flag,
      },
      { transaction }
    );

    // --- Step 3: Insert into ProductPricing ---
    for (const p of price) {
      await ProductPricing.create(
        {
          ...p,
          IpAddress,
          EntryDate: new Date().toJSON().toString(),
          UserName,
          flag,
        },
        { transaction }
      );
    }

    // --- Step 4: Insert into ProductContent ---
    for (const c of content) {
      await ProductContent.create(
        {
          ...c,
          IpAddress,
          EntryDate: new Date().toJSON().toString(),
          UserName,
          flag,
        },
        { transaction }
      );
    }

    // --- Step 5: Commit Transaction ---
    await transaction.commit();

    res.status(200).json({
      message: flag === "A" ? "Product added successfully" : "Product updated successfully",
      Success: true,
    });
  } catch (err) {
    // --- Step 6: Rollback on error ---
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// GET Product List with optional filters and pagination
export const getProducts = async (req, res) => {
  const { ProductUkeyId, ProductName, Page, PageSize } = req.query;
  const sequelize = await dbConection();
  try {
    let query = `select pm.*,SubCateName, cm.CategoryName, dm.FileName, dm.DocUkeyId from ProductMast pm left join SubCateMast sm on sm.SubUkeyId=pm.SubUkeyId left join CategoryMast cm on cm.CategoryId = pm.CategoryId left join DocMast dm on dm.MasterUkeyId = pm.ProductUkeyId AND dm.FileType <> 'pdf' WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as totalCount FROM ProductMast pm WHERE 1=1`;
    const replacements = {};

    if (ProductUkeyId) {
      query += " AND pm.ProductUkeyId = :ProductUkeyId";
      countQuery += " AND pm.ProductUkeyId = :ProductUkeyId";
      replacements.ProductUkeyId = ProductUkeyId;
    }
    if (ProductName) {
      query += " AND pm.ProductName LIKE :ProductName";
      countQuery += " AND pm.ProductName LIKE :ProductName";
      replacements.ProductName = `%${ProductName}%`;
    }

    query += " ORDER BY pm.EntryDate DESC";

    // total count
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const totalCount = countResult[0]?.totalCount || 0;

    // pagination
    const pageNum = parseInt(Page, 10);
    const pageSizeNum = parseInt(PageSize, 10);
    if (!isNaN(pageNum) && !isNaN(pageSizeNum) && pageNum > 0 && pageSizeNum > 0) {
      const offset = (pageNum - 1) * pageSizeNum;
      query += " OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY";
      replacements.offset = offset;
      replacements.pageSize = pageSizeNum;
    }

    const [results] = await sequelize.query(query, { replacements });
    res.status(200).json({ data: results, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await sequelize.close();
  }
};

// GET Product by ID with child data (ProductPricing, ProductContent)
export const getProductById = async (req, res) => {
  const { ProductUkeyId } = req.params;

  if (!ProductUkeyId) {
    return res.status(400).json({ error: "ProductUkeyId is required" });
  }

  const sequelize = await dbConection();

  try {
    // Get Product Master data
    const [productResult] = await sequelize.query(
      "select pm.*,SubCateName, cm.CategoryName, dm.FileName, dm.DocUkeyId from ProductMast pm left join SubCateMast sm on sm.SubUkeyId=pm.SubUkeyId left join CategoryMast cm on cm.CategoryId = pm.CategoryId left join DocMast dm on dm.MasterUkeyId = pm.ProductUkeyId where ProductUkeyId = :ProductUkeyId",
      { replacements: { ProductUkeyId } }
    );

    if (!productResult || productResult.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult[0];

    // Get ProductPricing child data
    const [pricingResult] = await sequelize.query(
      "SELECT * FROM ProductPricing WHERE ProductUkeyId = :ProductUkeyId ORDER BY EntryDate ASC",
      { replacements: { ProductUkeyId } }
    );

    // Get ProductContent child data
    const [contentResult] = await sequelize.query(
      "SELECT * FROM ProductContent WHERE ProductUkeyId = :ProductUkeyId ORDER BY EntryDate ASC",
      { replacements: { ProductUkeyId } }
    );
    
    // Get ProductContent child data
    const [brochureResult] = await sequelize.query(
      "SELECT FileType, DocUkeyId, FileName FROM DocMast WHERE MasterUkeyId = :ProductUkeyId and FileType = 'pdf' ORDER BY EntryDate ASC",
      { replacements: { ProductUkeyId } }
    );

    res.status(200).json({
      Master: product,
      price: pricingResult,
      content: contentResult,
      brochure: brochureResult[0],
      Success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
  const { ProductUkeyId } = req.params;
  const sequelize = await dbConection();
  const transaction = await sequelize.transaction();

  try {
      await ProductMast.destroy({
        where: { ProductUkeyId: ProductUkeyId }, transaction,
      });

      await ProductPricing.destroy({
        where: { ProductUkeyId: ProductUkeyId }, transaction,
      });

      await ProductContent.destroy({
        where: { ProductUkeyId: ProductUkeyId }, transaction,
      });

    await transaction.commit();
    res.status(200).json({ message: "Product deleted successfully", Success: true });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
