import Budget from "../models/Budget.js";

export const getBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    let budget = await Budget.findOne({ user: userId });

    if (!budget) {
      budget = await Budget.create({ user: userId });
    }

    res.json({ monthlyBudget: budget.monthlyBudget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const monthlyBudget = Number(req.body.monthlyBudget);

    if (Number.isNaN(monthlyBudget) || monthlyBudget < 0) {
      return res.status(400).json({ message: "Invalid budget amount" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: userId },
      { user: userId, monthlyBudget },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    res.json({ monthlyBudget: budget.monthlyBudget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
